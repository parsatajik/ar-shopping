import requests
from bs4 import BeautifulSoup
import re
import random
from money_parser import price_str
import json

useragents=['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4894.117 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4855.118 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4892.86 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4854.191 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4859.153 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.79 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36/null',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36,gzip(gfe)',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4895.86 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_3_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4860.89 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4885.173 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4864.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4877.207 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML%2C like Gecko) Chrome/100.0.4896.127 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.133 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_16_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4872.118 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_3_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4876.128 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML%2C like Gecko) Chrome/100.0.4896.127 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36']


def scrape_webpage(target_url="https://www.amazon.com/Bluetooth-Headphones-Cancellation-Sweatproof-Earphones/dp/B08JCTDZN"):

    if 'walmart' in target_url:
        return scrape_walmart(target_url)
    elif 'best' in target_url:
        return scrape_bestbuy(target_url)
    else:
        return scrape_amazon_api(target_url)

def scrape_amazon_api(product_url):
    obj = {}
    pid = product_url.rsplit('/')[-1]
    if pid is None or '/' in pid:
        # return dummy data 
        print(f"Request failed since no product ID could be found in the product URL; pid= {pid}")
        return None
    
    url = "https://api.scrapingdog.com/amazon/product"
    params = {
        "api_key": "65bac44310be157339ca4bfd",
        "domain": "com",
        "asin": pid,
    }
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        try:
            obj['title'] = data['title']
        except:
            obj['title'] = None
        try:
            obj['images'] = data['images']
        except:
            obj['images'] = None
        try:        
            obj['price'] = data['price']
            price = price_str(obj["price"])
            if price >= '50':
                obj["supports_bnpl"] = "True"
            else:
                obj["supports_bnpl"] = "False"
        except:
            obj['price'] = None
            obj["supports_bnpl"] = "False"
        try:
            obj['rating'] = data['average_rating']
        except:
            obj['rating'] = None
    else:
        print(f"Request failed with status code {response.status_code}")
    return obj

def scrape_walmart(product_url):
    target_url=f"https://api.scrapingdog.com/scrape?dynamic=false&url={product_url}&api_key=65bac44310be157339ca4bfd"
    obj = {}

    resp = requests.get(target_url)
    if resp.status_code != 200:
        print(f"Request failed with status code {response.status_code}")
        return None

    soup = BeautifulSoup(resp.text,'html.parser')

    try:
        obj["price"] = soup.find("span",{"itemprop":"price"}).text.replace("Now ","")
    except:
        obj["price"]=None
    try:
        obj["title"] = soup.find("h1",{"itemprop":"name"}).text
    except:
        obj["title"]=None
    try:
        obj["rating"] = soup.find("span",{"class":"rating-number"}).text.replace("(","").replace(")","")
    except:
        obj["rating"]=None


    image_divs = soup.findAll('div', attrs={'data-testid': 'media-thumbnail'})
    all_image_urls = []

    for div in image_divs:
        image = div.find('img', attrs={'loading': 'lazy'})
        if image:
            image_url = image['src']
        all_image_urls.append(image_url)

    obj["images"] = all_image_urls
    script = soup.find('script', {'id': '__NEXT_DATA__'})
    parsed_json = json.loads(script.text)

    try:
        enableAffirm = parsed_json['props']['pageProps']['bootstrapData']['cv']['cart']['_all_']['enableAffirm']
        if enableAffirm:
            obj['supports_bnpl'] = "True"
        else:
            obj['supports_bnpl'] = "False"
    except:
        obj['supports_bnpl'] = "False"

    print(obj)
    return obj

def scrape_bestbuy(product_url):
    obj = {}

    headers={"User-Agent":useragents[random.randint(0,31)],"accept-language": "en-US,en;q=0.9","accept-encoding": "gzip, deflate, br","accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"}
    
    resp = requests.get(product_url,headers=headers)

    if resp.status_code != 200:
        print(f"Request failed with status code {resp.status_code}")
        return None

    soup = BeautifulSoup(resp.text,'html.parser')

    runs = 0
    try:
        results = soup.findAll('div', attrs={'class': 'priceView-hero-price priceView-customer-price'})
        for listing in results:
            if runs >= 1: break
            element = soup.select_one('div.priceView-customer-price > span:first-child')
            if None in element:
                continue
            obj["price"] = element.get_text()
            runs += 1
    except: 
        obj["price"]=None
    try:    
        obj["title"] = soup.find("h1").text
    except: 
        obj["title"]=None

    all_img_urls = []
    try:
        results = soup.findAll('div', attrs={'class': 'collection-image'})
        for image in results:
            all_img_urls.append(image.img['src'])
        obj["images"] = all_img_urls
    except:
        obj["images"] = None

    # TODO could not find a way to check if affirm is enabled
    obj['supports_bnpl'] = "True"
    return obj
