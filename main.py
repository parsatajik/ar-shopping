import streamlit as st
import streamlit.components.v1 as components
from openai_vision import detect_objects
from search import search
from camera import start_camera
import cv2
from PIL import Image
import io

st.title("AR Shopping App")
st.header("Upload an image or capture from webcam")

option = st.selectbox("Choose an option", ("Upload an image", "Capture from webcam"))

if option == "Upload an image":
    image_file = st.file_uploader("Upload an image", type=["png", "jpg", "jpeg", "webp"])

    if image_file is not None:
        st.image(image_file, caption="Uploaded Image", use_column_width=True)

        with st.spinner("Processing..."):
            detected_objects = detect_objects(image_file)

        st.write(detected_objects)

        if detected_objects:
            search_results = search(detected_objects)
            for link, title in search_results.items():
                st.markdown(f"[{title}]({link})")
                # components.iframe(link)

elif option == "Capture from webcam":
    webrtc_ctx = start_camera()

    if st.button("Capture"):
        if webrtc_ctx.video_processor:
            webrtc_ctx.video_processor.frame_lock = True
            img = webrtc_ctx.video_processor.latest_frame
            webrtc_ctx.video_processor.frame_lock = False
            st.image(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), channels="RGB")

            # Convert the numpy array to a PIL image
            pil_img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

            # Convert the PIL image to a file-like object
            img_byte_arr = io.BytesIO()
            pil_img.save(img_byte_arr, format="PNG")
            img_byte_arr = img_byte_arr.getvalue()

            with st.spinner("Processing..."):
                detected_objects = detect_objects(img_byte_arr)

            st.write(detected_objects)

            if detected_objects:
                search_results = search(detected_objects)
                for link, title in search_results.items():
                    st.markdown(f"[{title}]({link})")
                    # components.iframe(link)
