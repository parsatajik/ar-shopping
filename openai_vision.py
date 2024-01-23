import os
import base64
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

client = OpenAI(
    api_key=OPENAI_API_KEY,
)

PROMPT = """
Analyze the image and identify all the products present. Please provide as much detail as possible, including the brand name, model, color, and any distinguishing features. If the product is something where dimensions would typically be relevant (like a TV, monitor, furniture, etc.), please also estimate its dimensions. If you don't know the brand name, just say 'I don't know the brand name' but give as many details about the product as you can. Based on these details, please provide the best possible search terms to find the exact or similar product on the internet. only output the search terms, not the product details.
"""


def encode_image(image_file):
    return base64.b64encode(image_file.read()).decode("utf-8")


def detect_objects(image_path):
    base64_image = encode_image(image_path)

    response = client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": PROMPT,
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                    },
                ],
            }
        ],
        max_tokens=300,
    )

    return response.choices[0].message.content
