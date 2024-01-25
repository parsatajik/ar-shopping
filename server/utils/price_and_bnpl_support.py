from selenium import webdriver
from PIL import Image
import io
import base64
import os
import base64
from dotenv import load_dotenv
from openai import OpenAI
import json

load_dotenv()

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

client = OpenAI(
    api_key=OPENAI_API_KEY,
)

PROMPT = """
Get the price of the product you see in the picture. 
Also, see if it supports a Buy Now Pay Later (BNPL) Option like Affirm. 
If not enough information for BNPL, just return false. 
IF this is an Amazon product, all items >$50 supports Affirm, and all items <$50 do not support Affirm. 
Return in this json format {"price": the_price, "supports_bnpl": true/false}
"""

def get_price_and_bnpl(url: str):
    print("link: ", url)
    #
    # Set up the webdriver options
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    
    #
    # Set up the webdriver
    driver = webdriver.Chrome(options=options)  # You need to have ChromeDriver installed
    driver.get(url)

    #
    # Take a screenshot
    screenshot = driver.get_screenshot_as_png()

    #
    # Convert to PIL Image
    image = Image.open(io.BytesIO(screenshot))

    #
    # Save as base64
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    base64_image = base64.b64encode(buffer.getvalue()).decode("utf-8")

    #
    # Close the webdriver
    driver.quit()

    #
    # convert json to python object. If it doesn't convert, send to openai again with a different prompt
    # saying that it didn't work and to try again giving more information
    for _ in range(10):
        try:
            response = json.loads(response.choices[0].message.content)
            return response
        except:
            response = client.chat.completions.create(
                model="gpt-4-vision-preview",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": PROMPT + "PLEASE ADHERE TO THE JSON FORMAT!",
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

    #
    # If it doesn't work after 10 tries, just return a default value
    return {"price": -1, "supports_bnpl": False}
