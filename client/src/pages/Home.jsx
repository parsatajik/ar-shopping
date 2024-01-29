import React, { useState, useEffect } from "react";

import ImageUploader from "../components/ImageUploader";
import Camera from "../components/Camera";
import SearchResults from "../components/SearchResults";
import Modal from "../components/Modal";
import LOGO_LARGE from "../logo-large.svg";
import axios from "axios";


const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductLink, setSelectedProductLink] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image_file", selectedFile);

    try {
      setIsLoading(true);

      const response = await axios.post(
        "http://localhost:8000/uploadfile/",
        formData
      );

      if (response.status === 200) {
        setResults(response.data.results);
        console.log(response.data.results);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      handleUpload();
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

  const MOCKED_RESULTS = [
    {
      id: 1,
      title: "Product 1",
      price: 1000,
      link: "https://via.placeholder.com/150",
      image_url: "https://via.placeholder.com/150",
      supports_bnpl: true,
    },
    {
      id: 2,
      title: "Product 2",
      price: 2000,
      link: "https://via.placeholder.com/150",
      image_url: "https://via.placeholder.com/150",
      supports_bnpl: true,
    },
    {
      id: 3,
      title: "Product 3",
      price: 3000,
      link: "https://via.placeholder.com/150",
      image_url: "https://via.placeholder.com/150",
      supports_bnpl: true,
    },
    {
      id: 4,
      title: "Product 4",
      price: 4000,
      link: "https://via.placeholder.com/150",
      image_url: "https://via.placeholder.com/150",
      supports_bnpl: false,
    },
    {
      id: 5,
      title: "Product 5",
      price: 5000,
      link: "https://via.placeholder.com/150",
      image_url: "https://via.placeholder.com/150",
      supports_bnpl: false,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-center gap-10">
      <div className="w-full flex flex-col">
        <h2 className="block text-gray-700 text-xl font-bold mb-4">
          Upload or Capture Your Image
        </h2>
        <ImageUploader handleFileChange={handleFileChange} />
        <Camera />
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col items-center justify-center p-10">
            <img src={LOGO_LARGE} alt="Affirm Logo" className="mb-4" />
            <h3 className="text-xl font-bold mb-4">Buy Now, Pay Over Time</h3>
            <lottie-player
              autoplay
              loop
              mode="normal"
              src="https://lottie.host/2259fab8-4b05-4734-98a5-30d0155afdf1/hLtopSNTBI.json"
            ></lottie-player>
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
  );
};

export default Home;
