import React, { useCallback, useEffect } from "react";
import LOGO from "../logo.svg";
import { useSpeechRecognition } from "react-speech-recognition";

const Loading = ({ ARMode }) => (
  <div
    className={`animate-pulse flex flex-row gap-4 bg-white shadow-md rounded px-2 h-sm:px-6 pt-2 pb-2 h-sm:pt-4 h-sm:pb-6 mb-4 relative transform transition duration-500 ${
      ARMode ? "max-h-[calc(100vh/7)]" : ""
    }`}
  >
    <div
      className={`w-1/4 h-10 h-sm:h-24 bg-gray-300 rounded ${
        ARMode ? "max-h-[calc(100vh/7)]" : ""
      }`}
    ></div>
    <div
      className={`w-3/4 space-y-4 py-1 ${
        ARMode ? "max-h-[calc(100vh/7)]" : ""
      }`}
    >
      <div
        className={`h-2 h-sm:h-4 bg-gray-300 rounded w-3/4 ${
          ARMode ? "max-h-[calc(100vh/7)]" : ""
        }`}
      ></div>
      <div
        className={`h-2 h-sm:h-4 bg-gray-300 rounded ${
          ARMode ? "max-h-[calc(100vh/7)]" : ""
        }`}
      ></div>
    </div>
  </div>
);

const Result = ({
  title,
  price,
  link,
  image_url,
  supports_bnpl,
  handleResultClick,
  ARMode,
}) => {
  const resultClass = `flex flex-row gap-4 bg-white shadow-md rounded px-6 pt-1 pb-2 h-sm:pt-4 h-sm:pb-6 mb-4 relative transform transition duration-500 hover:scale-105 ${
    ARMode ? "max-h-[calc(100vh/7)]" : ""
  }`;
  const imageClass = `w-1/4 ${ARMode ? "max-h-[calc(100vh/7)]" : ""}`;

  return (
    <div className={resultClass} onClick={() => handleResultClick(link)}>
      {supports_bnpl && (
        <img
          src={LOGO}
          alt="Supports BNPL"
          className="absolute top-2 right-2 h-4 w-4 h-sm:h-7 h-sm:w-7"
        />
      )}
      <div className={imageClass}>
        <img
          src={image_url}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className={`w-3/4 ${
          ARMode ? "max-h-[calc(100vh/7)] flex flex-row h-sm:flex-col" : ""
        }`}
      >
        <h4
          className={`text-gray-700 ${
            ARMode
              ? "text-xs h-sm:text-base max-h-[15ch] max-w-[17ch] h-sm:max-h-full h-sm:max-w-full overflow-hidden text-ellipsis"
              : "text-lg"
          } font-semibold mr-4`}
        >
          {title}
        </h4>
        <p
          className={`text-gray-500 mt-3 ${
            ARMode ? "text-xs h-sm:text-sm" : "base"
          }`}
        >
          {price}
        </p>
      </div>
    </div>
  );
};

const SearchResults = ({
  results,
  selectedFile,
  isLoading,
  setSelectedProductLink,
  setIsModalOpen,
  isModalOpen,
  ARMode,
}) => {
  const handleResultClick = (link) => {
    setSelectedProductLink(link);
    setIsModalOpen(true);
  };

  const resultsContainerClass = `text-gray-700 ${
    ARMode ? "max-h-screen" : ""
  } ${ARMode && isModalOpen ? "opacity-30" : ""}`;

  const handleProductSelection = useCallback(
    (productNumber) => {
      console.log(productNumber);
      const numberWords = ["one", "two", "three", "four", "five"];
      const index = numberWords.indexOf(productNumber.toLowerCase());
      if (index >= 0 && index < results.length) {
        const productLink = results[index].link;
        handleResultClick(productLink);
      }
    },
    [results, setSelectedProductLink, setIsModalOpen]
  );

  const commands = [
    {
      command: "Product :number",
      callback: (number) => handleProductSelection(number),
      matchInterim: true,
    },
  ];

  const { listening, browserSupportsSpeechRecognition } = useSpeechRecognition({
    commands,
  });

  return (
    <div className={resultsContainerClass}>
      {isLoading || results.length > 0 ? (
        <>
          {!ARMode && <h3 className="text-lg font-semibold mb-4">Results</h3>}
          {results.map((result, index) => (
            <Result
              {...result}
              handleResultClick={handleResultClick}
              key={`result-${index}`}
              ARMode={ARMode}
            />
          ))}
          {results.length === 0 &&
            [...Array(5)].map((_, index) => (
              <Loading key={`loading-${index}`} ARMode={ARMode} />
            ))}
        </>
      ) : selectedFile ? (
        <>
          {!ARMode && <h3 className="text-lg font-semibold mb-4">Results</h3>}
          <p className="mt-3">No results found.</p>
        </>
      ) : (
        !ARMode && (
          <>
            <h3 className="text-lg font-semibold mb-4">Results</h3>
            <p className="mt-3">
              Please upload or capture your product's image 😊
            </p>
          </>
        )
      )}
    </div>
  );
};

export default SearchResults;
