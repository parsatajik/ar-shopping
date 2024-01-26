import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from 'socket.io-client';

import ImageUploader from "../components/ImageUploader";
import Camera from "../components/Camera";
import SearchResults from "../components/SearchResults";
const WEBSOCKET_URL = 'ws://localhost:8000/ws'

const socket = io("ws://localhost:3000/ws", { path: "/ws/socket.io/", transports: ['websocket', 'polling'] });
  
socket.on("connect", () => { console.log("Connected", socket.id) });
socket.on("response", () => { console.log("Response", socket.id) });
socket.on("message", data => { console.log(data) });

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileb64, setSelectedFileb64] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  const handleFileChange = (event) => {
    const data = new FileReader()
    data.addEventListener('load', ()=> {
        setSelectedFileb64(data.result)
    })
    data.readAsDataURL(event.target.files[0])
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    //const formData = new FormData();
    //formData.append("image_file", selectedFile);

    try {
      setIsLoading(true);
      console.log(selectedFileb64)
      // TODO: add error in case file is not set or socket is closed
      if (selectedFileb64) {
        socket.send(selectedFileb64)
        console.log("sent b64 image to server");
      }

      /*const response = await axios.post(
        "http://localhost:8000/uploadfile/",
        formData
      );

      if (response.status === 200) {
        setResults(response.data.results);
        console.log(response.data.results);
      } else {
        console.error("Error:", response.statusText);
      }*/
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const newSocket = new WebSocket(WEBSOCKET_URL);
    setSocket(newSocket);
    return;// (); //=> newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.onopen = function (event) {
      console.log("WebSocket connected");
    };

    socket.onmessage = function (event) {
      // TODO: setResults here
      console.log("Received message:", event.data);
    };

    socket.onclose = function (event) {
      console.log("WebSocket closed");
      setIsLoading(false);
      socket.close();
      //const newSocket = new WebSocket(WEBSOCKET_URL);
      //setSocket(newSocket);
    };
  
    socket.onerror = function (error) {
        console.error("Error:", error)
        setIsLoading(false);
        socket.close();
    };

    return () => {
      socket.close();
    };
  }, [socket]);
  
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
