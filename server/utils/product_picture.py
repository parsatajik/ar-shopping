import os
import requests
from dotenv import load_dotenv

load_dotenv()

def searchPicture(title):
    api_key = os.environ.get("SEARCH_ENGINE_API_KEY")
    cx = os.environ.get("SEARCH_ENGINE_ID")
    api_url = f"https://www.googleapis.com/customsearch/v1?q={title}&key={api_key}&cx={cx}&searchType=image"

    data = requests.get(api_url).json()

    if 'items' in data and len(data['items']) > 0:
        first_image_url = data['items'][0]['link']
        return first_image_url
    
    return "https://precisionpharmacy.net/wp-content/themes/apexclinic/images/no-image/No-Image-Found-400x264.png"