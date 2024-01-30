README.md
AR Shopping App

This application uses OpenAI's GPT-4 Vision model to identify products in an image and then searches for these products on the internet.
Setup

To run the UI:
1. cd into the client directory
2. run npm install
3. run npm start
4. open localhost:3000 in your browser

To run the server:

1. Create a Python virtual environment

You can create a Python virtual environment using the venv module:
```bash
python3 -m venv vision
```


This will create a new virtual environment named env.

2. Activate the virtual environment

Before you can start installing or using packages in your virtual environment you’ll need to activate it. Activation associates your shell session with the virtual environment.

- On macOS and Linux:
```bash
    source vision/bin/activate
```

- On Windows:
```bash
    .\vision\Scripts\activate
```

3. Install the required packages

Install all the necessary packages using the requirements.txt file:
```bash
    pip install -r requirements.txt
```

4. Set up your environment variables

Create a .env file in the root directory of your project and add your environment variables to it:
```
   OPENAI_API_KEY=your_openai_key
   SEARCH_ENGINE_API_KEY=your_google_api_key
   SEARCH_ENGINE_ID=your_google_cx
```


Replace your_openai_key, your_google_api_key, and your_google_cx with your actual keys.

5. cd into the server directory, and run the server using uvicorn

```bash
    uvicorn main:app --reload
```

6. (Optionally) Run the streamlit version from the root directory

You can run the application using Streamlit:
```bash
    python -m streamlit run main.py
```

This will start the Streamlit server and open the application in your web browser.

Remember to never commit your .env file to version control. It contains sensitive data. Add it to your .gitignore file.

7. Creating and running a docker container

You can containerize this application by running the following command:
```bash
docker build -t ar-shopping:latest .
```

After the container is created, you can run image accordingly:
```bash
docker run -p 8000:80 -e OPENAI_API_KEY=OPENAI_API_KEY -e SEARCH_ENGINE_ID=SEARCH_ENGINE_ID -e SEARCH_ENGINE_API_KEY=SEARCH_ENGINE_API_KEY ar-shopping:latest
```
Make sure to replace the placeholder env variabels with correct ones.

If you're having issues with stopping the container you can run the following command:
```bash
docker kill $(docker ps -q -f publish=8000)
```
