import json
import requests
from dotenv import load_dotenv

load_dotenv()

def search(query):
    api_key = "AIzaSyAlnHpQbt9AFsKT3jlUP5wLUE_oBgnAic0"
    cx = "867690ce5a8ad442b"
    url = f"https://www.googleapis.com/customsearch/v1?cx={cx}&q={query}&key={api_key}"

    print(f"Query: {query}")  

    data = requests.get(url).json()
    print(f"API Response: {data}")  

    search_items = data.get("items")
    if search_items is None:  
        print("No items in API response")
        return {}

    results = {}
    for search_item in search_items:
        title = search_item.get("title")
        link = search_item.get("link")
        results[link] = title
    return results