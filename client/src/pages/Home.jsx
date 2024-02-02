import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import ImageUploader from "../components/ImageUploader";
import Sidebar from "../components/Sidebar";
import Camera from "../components/Camera";
import SearchResults from "../components/SearchResults";
import Modal from "../components/Modal";
import { uploadImage } from "../utils/functions";

import LOGO_LARGE from "../logo-large.svg";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductLink, setSelectedProductLink] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const commands = [
    {
      command: "AR Mode",
      callback: () => (window.location.pathname = "/ar-mode"),
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
      console.log("Browser doesn't support speech recognition or microphone is not available.");
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
    if (selectedFile) {
      uploadImage(selectedFile, setResults, setIsLoading);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        setIsModalOpen(false);
        if (selectedProductLink) {
          window.open(selectedProductLink, "_blank");
        }
      }, 3000);
    }
  }, [isModalOpen]);

  return (
    <>
      <Sidebar />

      <div className="flex flex-col md:flex-row justify-center gap-10 mx-auto mt-0 lg:mt-10 max-w-5xl p-8">
        <div className="w-full flex flex-col">
          <h2 className="block text-gray-700 text-xl font-bold mb-4">
            Upload or Capture Your Image
          </h2>
          <ImageUploader handleFileChange={handleFileChange} />
          <Camera setSelectedFile={setSelectedFile} />
          <div>
            <h2 className="block text-gray-700 text-xl font-bold mt-8 mb-4">
              Alternatively, Enter AR Mode 😎
            </h2>
            <p className="text-gray-500 mt-3">
              Click the button below or simply say <strong>"AR Mode"</strong>
            </p>
            <button
              onClick={() => (window.location.pathname = "/ar-mode")}
              className="w-full bg-primary-base hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 text-sm shadow-md"
            >
              Enter AR Mode
            </button>
          </div>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="flex flex-col items-center justify-center p-10">
              <img src={LOGO_LARGE} alt="Affirm Logo" className="mb-4" />
              <h3 className="text-xl font-bold mb-4">Buy Now, Pay Over Time</h3>
              <p className="mt-4">We're taking you to your product...</p>
            </div>
          </Modal>
        </div>
        <div className="w-full">
          <SearchResults
            results={results}
            selectedFile={selectedFile}
            isLoading={isLoading}
            setSelectedProductLink={setSelectedProductLink}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
