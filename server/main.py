import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from utils.openai_vision import detect_objects
from utils.search import search
from utils.price_and_bnpl_support import get_price_and_bnpl
from utils.product_picture import searchPicture
from utils.scrape import scrape_webpage
from concurrent.futures import ThreadPoolExecutor
import concurrent.futures


app = FastAPI()

client_build_dir = os.getenv("CLIENT_BUILD_DIR", "/app/client/build")

# Configure CORS settings
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#
# Validate file.
def validate_image(file: UploadFile):
    allowed_image_types = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg"]

    if file.content_type not in allowed_image_types:
        raise HTTPException(
            status_code=400, detail="Invalid image type. Supported types: JPEG, PNG, GIF"
        )


def process_link_using_selenium(link, title):
    image = searchPicture(title)
    print("image: ", image)
    price_and_bnpl_support = get_price_and_bnpl(link)
    return {
        "title": title,
        "price": price_and_bnpl_support["price"],
        "supports_bnpl": price_and_bnpl_support["supports_bnpl"],
        "image_url": image,
    }


def process_link(link, title):
    print(f"Scrapping weblink {link}")
    try:
        price_and_bnpl_support = scrape_webpage(link)
        if price_and_bnpl_support is None:
            print(f"Could not successfully scrape the webpage: {link}")
            return "Invalid"

        image_url = None
        if "images" in price_and_bnpl_support and len(price_and_bnpl_support["images"]) > 0:
            image_url = price_and_bnpl_support["images"][0]
        else:
            image_url = searchPicture(title)
            print("Falling back to searching image via Google API: ", image_url)
        return {
            "link": link,
            "title": title,
            "price": price_and_bnpl_support["price"],
            "supports_bnpl": price_and_bnpl_support["supports_bnpl"],
            "image_url": image_url,
        }
    except Exception as e:
        print(f"Could not successfully scrape the webpage: {link}")
        return "Invalid"


# Serve React static files
app.mount("/", StaticFiles(directory=client_build_dir, html=True), name="static")


# Main route.
@app.post("/uploadfile/")
def create_upload_file(image_file: UploadFile = File(...)):
    validate_image(image_file)

    image_content = image_file.file.read()

    detected_objects = detect_objects(image_content)

    if detected_objects:
        search_results = search(detected_objects, 5)  # Limit to 3 results

        # Use ThreadPoolExecutor to run the processing in parallel
        with ThreadPoolExecutor() as executor:
            futures = []
            for link, title in search_results.items():
                future = executor.submit(process_link, link, title)
                futures.append(future)

            # Wait for all futures to complete
            concurrent.futures.wait(futures)

            processed_results = []
            # Get the results from the completed futures
            for future in futures:
                if "Invalid" in future.result():
                    continue
                processed_results.append(future.result())

            # Update the search_results with the processed results
        return {"results": processed_results}
    else:
        return {"error": "No objects detected in the image."}
