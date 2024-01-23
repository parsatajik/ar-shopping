from streamlit_webrtc import VideoProcessorBase, RTCConfiguration, WebRtcMode, webrtc_streamer
import av

RTC_CONFIGURATION = RTCConfiguration({"iceServers": [{"urls": ["stun:stun.l.google.com:19302"]}]})


class VideoProcessor(VideoProcessorBase):
    frame_lock: bool = False
    latest_frame = None

    def recv(self, frame: av.VideoFrame) -> av.VideoFrame:
        if self.frame_lock:
            return av.VideoFrame.from_ndarray(self.latest_frame, format="bgr24")
        else:
            self.latest_frame = frame.to_ndarray(format="bgr24")
            return frame


def start_camera():
    webrtc_ctx = webrtc_streamer(
        key="live",
        mode=WebRtcMode.SENDRECV,
        rtc_configuration=RTC_CONFIGURATION,
        video_processor_factory=VideoProcessor,
        async_processing=True,
    )
    return webrtc_ctx
