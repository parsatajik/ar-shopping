import requests
from bs4 import BeautifulSoup
import re
import random
from money_parser import price_str
import json

specs_arr = []
specs_obj = {}

# we need to change headers on every request else Amazon can recognize our header and can block it eventually.
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

    # TODO: tweak this for other merchants, but this is only for Amazon
    headers={"User-Agent":useragents[random.randint(0,31)],"accept-language": "en-US,en;q=0.9","accept-encoding": "gzip, deflate, br","accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"}

    l=[]
    resp = requests.get(target_url, headers=headers)
    
    if(resp.status_code != 200):
        print("Could not query the URL")
        raise Exception("Failed to query the URL!")

    soup = BeautifulSoup(resp.text,'html.parser')

    if 'walmart' in target_url:
        return scrape_walmart(soup, resp)
    else:
        return scrape_amazon(soup, resp)


def scrape_amazon(soup, resp):
    obj = {}
    try:
        obj["title"] = soup.find('h1',{'id':'title'}).text.lstrip().rstrip()
    except:
        obj["title"] = None


    images = re.findall('"hiRes":"(.+?)"', resp.text)
    obj["images"] = images
    try:
        obj["price"] = soup.find("span",{"class":"a-price"}).find("span").text
        price = price_str(obj["price"])
        if price >= '50':
            obj["supports_bnpl"] = "True"
            print(obj)
        else:
            obj["supports_bnpl"] = "False"
    except:
        obj["price"] = None
        obj["supports_bnpl"] = "False"


    try:
        obj["rating"] = soup.find("i",{"class":"a-icon-star"}).text
    except:
        obj["rating"] = None


    specs = soup.find_all("tr",{"class":"a-spacing-small"})

    for u in range(0,len(specs)):
        spanTags = specs[u].find_all("span")
        specs_obj[spanTags[0].text]=spanTags[1].text


    specs_arr.append(specs_obj)
    obj["specs"] = specs_arr
    return obj



def scrape_walmart(soup, resp):
    obj = {}
    try:
        obj["price"] = soup.find("span",{"itemprop":"price"}).text.replace("Now ","")
    except:
        obj["price"]=None
    try:
        obj["name"] = soup.find("h1",{"itemprop":"name"}).text
    except:
        obj["name"]=None
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

    return obj


