import streamlit as st
from openai_vision import detect_objects
from search import search

image_file = st.file_uploader("Upload an image", type=["png", "jpg", "jpeg", "webp"])

if image_file is not None:

    st.image(image_file, caption="Uploaded Image", use_column_width=True)

    with st.spinner('Processing...'):
        detected_objects = detect_objects(image_file)

    st.write(detected_objects)

    if detected_objects:
        search_results = search(detected_objects)

        st.table(search_results)
        
