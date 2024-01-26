import React, { useState, useEffect } from "react";
import axios from "axios";

import ImageUploader from "../components/ImageUploader";
import Camera from "../components/Camera";
import SearchResults from "../components/SearchResults";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      </div>
      <div className="w-full">
        <SearchResults
          results={results}
          selectedFile={selectedFile}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Home;
