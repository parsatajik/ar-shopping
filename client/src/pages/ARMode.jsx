import React, { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import Modal from "../components/Modal";
import SearchResults from "../components/SearchResults";
import LOGO_LARGE from "../logo-large.svg";
import { uploadImage } from "../utils/functions";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const ARMode = () => {
  const webcamRef = useRef(null);
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(true);
  const [isAffirmModalOpen, setIsAffirmModalOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProductLink, setSelectedProductLink] = useState(null);
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight || window.innerWidth > 800
  );
  const [isRequestActive, setIsRequestActive] = useState(false); // New state variable to track request status

  const handleFindProduct = useCallback(() => {
    if (isRequestActive) {
      console.log("A request is already in progress.");
      return;
    }

    setResults([]);

    if (!isLandscape) {
      alert("Please rotate your device to landscape orientation to proceed.");
      return;
    }

    if (webcamRef.current) {
      setIsRequestActive(true);
      const imageSrc = webcamRef.current.getScreenshot();

      if (imageSrc) {
        const byteString = atob(imageSrc.split(",")[1]);
        const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });

        uploadImage(blob, setResults, setIsLoading).finally(() => {
          setIsRequestActive(false);
        });
      } else {
        console.error("Failed to capture the image from the webcam.");
        setIsRequestActive(false);
      }
    } else {
      console.error("Webcam is not ready.");
    }
  }, [webcamRef]);

  const commands = [
    {
      command: "Find Product",
      callback: () => handleFindProduct(),
      matchInterim: true,
    },
    {
      command: "Got it",
      callback: () => setIsInstructionModalOpen(false),
      matchInterim: true,
    },
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (!browserSupportsSpeechRecognition || !isMicrophoneAvailable) {
      console.log(
        "Browser doesn't support speech recognition or microphone is not available."
      );
      return;
    }

    const startListening = async () => {
      try {
        await SpeechRecognition.startListening({ continuous: true });
        console.log("Speech recognition started");
      } catch (error) {
        console.error("Error starting speech recognition: ", error);
      }
    };

    startListening();
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  useEffect(() => {
    const handleResize = () => {
      const newIsLandscape =
        window.innerWidth > window.innerHeight || window.innerWidth > 800;
      setIsLandscape(newIsLandscape);

      // If the device is rotated to landscape, start a timer to automatically close the modal
      if (newIsLandscape && isInstructionModalOpen) {
        const timer = setTimeout(() => {
          setIsInstructionModalOpen(false);
        }, 15000); // Close the modal after 10 seconds

        // Cleanup the timer if the component unmounts or if the modal is manually closed before the timer expires
        return () => clearTimeout(timer);
      } else if (!newIsLandscape) {
        setIsInstructionModalOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isInstructionModalOpen]);

  useEffect(() => {
    if (isAffirmModalOpen) {
      setTimeout(() => {
        setIsAffirmModalOpen(false);
        if (selectedProductLink) {
          window.open(selectedProductLink, "_blank");
        }
      }, 3000);
    }
  }, [isAffirmModalOpen, selectedProductLink]);

  return (
    <div className="w-screen h-screen relative bg-gray-800">
      <img
        src={LOGO_LARGE}
        alt="Logo"
        className="absolute top-4 left-4 h-auto z-10 opacity-30 w-24 md:w-36 lg:w-48 xl:w-52"
      />
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      {isLandscape && (
        <button
          className="absolute top-2 h-sm:top-4 right-4 z-20 font-bold py-2 px-4 rounded focus:outline-none text-sm shadow-md bg-primary-base hover:bg-primary-dark text-white opacity-40"
          onClick={handleFindProduct}
        >
          Press to find product or Simply say "Find Product"
        </button>
      )}
      <div className="absolute top-14 h-sm:top-20 right-4 z-30 w-1/3">
        <SearchResults
          results={results}
          isLoading={isLoading}
          setSelectedProductLink={setSelectedProductLink}
          setIsModalOpen={setIsAffirmModalOpen}
          isModalOpen={isAffirmModalOpen}
          ARMode={true}
        />
      </div>
      <Modal
        isOpen={isInstructionModalOpen}
        onClose={() => setIsInstructionModalOpen(false)}
      >
        <div className="flex flex-col items-center justify-center p-10">
          <h2 className="text-2xl font-bold mb-2">AR Mode Instructions</h2>
          <div className="block md:hidden">
            <p className="mb-4 text-center font-bold">
              🌟 Please rotate your device to Horizontal View 🌟
            </p>
          </div>
          <p className="mb-4 text-center">
            To find a product, please say <strong>"Find Product"</strong>. Our
            AI will then find you the best deals on the internet!
          </p>
          <p className="mb-4 text-center">
            To select a product, simply click on it. You can also say{" "}
            <strong>"Product #"</strong> like <strong>"Product 1"</strong> to
            select a product.
          </p>
          <p className="mb-4 text-center">
            This modal will close in 15 seconds. You can also click the button
            below to close it or say <strong>"Got It"</strong> 🙂
          </p>
          <button
            className="font-bold py-2 px-4 rounded focus:outline-none mt-4 text-sm shadow-md bg-primary-base hover:bg-primary-dark text-white w-full"
            onClick={() => setIsInstructionModalOpen(false)}
            disabled={!isLandscape}
          >
            Got it!
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={isAffirmModalOpen}
        onClose={() => setIsAffirmModalOpen(false)}
      >
        <div className="flex flex-col items-center justify-center p-10">
          <img src={LOGO_LARGE} alt="Affirm Logo" className="mb-4" />
          <h3 className="text-xl font-bold mb-4">Buy Now, Pay Over Time</h3>
          <p className="mt-4">We're taking you to your product...</p>
        </div>
      </Modal>
    </div>
  );
};

export default ARMode;
