import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

def search(query, top_n=1):
    api_key = os.environ.get("SEARCH_ENGINE_API_KEY")
    cx = os.environ.get("SEARCH_ENGINE_ID")
    url = f"https://www.googleapis.com/customsearch/v1?cx={cx}&q={query}&key={api_key}"

    # print(f"Query: {query}")  

    data = requests.get(url).json()
    # print(f"API Response: {data}")  

    search_items = data.get("items")
    if search_items is None:  
        # print("No items in API response")
        return {}

    results = {}
    for i, search_item in enumerate(search_items):
        if i >= top_n:  # Limit
            break

        title = search_item.get("title")
        link = search_item.get("link")
        results[link] = title
    return results