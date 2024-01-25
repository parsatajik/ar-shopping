import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const openCamera = async () => {
    if (navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } else {
      console.error("Camera not available");
    }
  };

  const handleCaptureClick = () => {
    setHasPhoto(true);
  };

  const handleClearClick = () => {
    setIsClearing(true);
    const context = canvasRef.current.getContext("2d");
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setTimeout(() => {
      setHasPhoto(false);
      setIsClearing(false);
    }, 25); 
  };

  useEffect(() => {
    openCamera();
  }, []);

  useEffect(() => {
    if (hasPhoto) {
      const context = canvasRef.current.getContext("2d");
      const video = videoRef.current;
      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    }
  }, [hasPhoto]);

  return (
    <div className="flex flex-col">
      <video
        ref={videoRef}
        className="w-full h-auto rounded shadow-md"
        autoPlay
      />
      <AnimatePresence>
        {hasPhoto && (
          <motion.canvas
            ref={canvasRef}
            className="mt-4 w-full rounded shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          />
        )}
      </AnimatePresence>
      <div className="flex">
        <button
          onClick={handleCaptureClick}
          className="w-full bg-primary-base hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 text-sm shadow-md"
        >
          Capture
        </button>
        <AnimatePresence>
          {!isClearing && hasPhoto && (
            <motion.button
              onClick={handleClearClick}
              className="bg-greyscale-black-50 hover:bg-greyscale-black-60 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 text-sm shadow-md ml-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2, exit: { duration: 0 } }}
            >
              Clear
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Camera;
