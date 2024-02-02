import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { AnimatePresence, motion } from "framer-motion";
import { useSpeechRecognition } from "react-speech-recognition";

const Camera = ({ setSelectedFile }) => {
  const webcamRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const handleCaptureClick = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();

      if (imageSrc) {
        setImageSrc(imageSrc);
        const byteString = atob(imageSrc.split(",")[1]);
        const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });

        setSelectedFile(blob);
        setHasPhoto(true);
      } else {
        console.error("Failed to capture the image from the webcam.");
      }
    } else {
      console.error("Webcam is not ready.");
    }
  }, [webcamRef, setSelectedFile]);

  const handleClearClick = () => {
    setIsClearing(true);
    setTimeout(() => {
      setHasPhoto(false);
      setIsClearing(false);
      setImageSrc(null);
    }, 25);
  };

  const renderImageOrWebcam = () => {
    const commonProps = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
      className: "w-full h-auto rounded shadow-md",
    };

    return imageSrc ? (
      <motion.img src={imageSrc} alt="Captured Product" {...commonProps} />
    ) : (
      <motion.div {...commonProps}>
        <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" />
      </motion.div>
    );
  };

  const renderButton = () => {
    const commonProps = {
      className:
        "w-full font-bold py-2 px-4 rounded focus:outline-none mt-4 text-sm shadow-md",
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 },
      transition: { duration: 0.2, exit: { duration: 0 } },
    };

    return !imageSrc ? (
      <motion.button
        onClick={handleCaptureClick}
        {...commonProps}
        className={`${commonProps.className} bg-primary-base hover:bg-primary-dark text-white`}
      >
        Capture
      </motion.button>
    ) : (
      <motion.button
        onClick={handleClearClick}
        {...commonProps}
        className={`${commonProps.className} bg-greyscale-black-50 hover:bg-greyscale-black-60 text-white`}
      >
        Clear
      </motion.button>
    );
  };

  const commands = [
    {
      command: "Capture",
      callback: () => handleCaptureClick(),
      matchInterim: true,
    },
  ];

  // const { transcript, resetTranscript } = useSpeechRecognition({ commands });

  return (
    <div className="flex flex-col">
      <AnimatePresence>{renderImageOrWebcam()}</AnimatePresence>
      <AnimatePresence>{renderButton()}</AnimatePresence>
    </div>
  );
};

export default Camera;
