from fastapi import FastAPI, WebSocket, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from utils.openai_vision import detect_objects
from utils.search import search
from utils.price_and_bnpl_support import get_price_and_bnpl
from utils.product_picture import searchPicture
from utils.scrape import scrape_webpage
from concurrent.futures import ThreadPoolExecutor
import concurrent.futures
import asyncio
import re
import urllib.request


app = FastAPI()

# Configure CORS settings
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
    "ws://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

aq = asyncio.Queue()


class ConnectionManager:
    last_message = ""

    def __init__(self) -> None:
        self.connections = {}

    async def connect(self, conn_id: str, websocket: WebSocket):
        await websocket.accept()
        self.connections[conn_id] = websocket

    async def disconnect(self, conn_id):
        websocket: WebSocket = self.connections[conn_id]
        await websocket.close()
        del self.connections[conn_id]

    async def send_messages(self, conn_id, message):
        websocket: WebSocket = self.connections[conn_id]
        print("hi I am here in send message...!!!!")
        print(websocket)
        print(type(message))
        await websocket.send_json(message)


manager = ConnectionManager()


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
        image_url = None
        # TODO: with try/except can remove all these checks so it falls back on selenium
        if "images" in price_and_bnpl_support and len(price_and_bnpl_support["images"]) > 0:
            # TODO: Pick the first image (hopefully this works but since I couldnt render, not sure)
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
        # print(e)
        print("Falling back to Selenium!")
        return process_link_using_selenium(link, title)


# Validate file.
def validate_image_type(image_type):
    allowed_image_types = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg"]
    print("Valiating image type")
    if image_type not in allowed_image_types:
        print("Invalid Image name")
        return False
    return True


async def process_image(data):
    print(re.split(";|:", data))
    image_type = re.split(";|:", data)[1]
    result = validate_image_type(image_type)
    if not result:
        await aq.put({"error": "Invalid image type. Supported types: JPEG, PNG, GIF"})
        return {"results": "Invalid Image!"}

    response = urllib.request.urlopen(data)
    image_data = response.file.read()
    detected_objects = detect_objects(image_data)
    results = {}
    if detected_objects:
        search_results = search(detected_objects, 5)
        processed_results = []
        # Use ThreadPoolExecutor to run the processing in parallel
        with ThreadPoolExecutor() as executor:
            futures = []
            for link, title in search_results.items():
                future = executor.submit(process_link, link, title)
                futures.append(future)

            for f in concurrent.futures.as_completed(futures):
                result = f.result()
                print(result)
                await aq.put({**result})

        return {"results": "done"}
    else:
        return {"error": "No objects detected in the image."}


# Consumer sending data to client
async def process_data(q):
    while True:
        print("Waiting on processing data from queue")
        data = await q.get()
        print(f"processing: {data}")
        # TODO: Need to change the conn_id
        await manager.send_messages("1", data)


#
# Main route
@app.websocket("/ws")
async def upload_file_ws(websocket: WebSocket):
    # TODO: change hardcoded connection id
    # Accept WebSocket connection
    await manager.connect("1", websocket)
    try:
        while True:
            print(manager.connections.get("1"))
            data = await websocket.receive_text()
            if data:
                await process_image(data)
    except Exception as e:
        print(e)
        await manager.disconnect("1")


@app.on_event("startup")
async def start_up():
    consumers = asyncio.create_task(process_data(aq))
    # await asyncio.gather(consumers)
    # await aq.join()
