from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from utils.openai_vision import detect_objects
from utils.search import search


app = FastAPI()

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
        raise HTTPException(status_code=400, detail="Invalid image type. Supported types: JPEG, PNG, GIF")

#
# Main route.
@app.post("/uploadfile/")
def create_upload_file(image_file: UploadFile = File(...)):
    validate_image(image_file)

    image_content = image_file.file.read()

    detected_objects = detect_objects(image_content)

    if detected_objects:
        search_results = search(detected_objects)
        
        return {"results": search_results}
    else:
        return {"error": "No objects detected in the image."}