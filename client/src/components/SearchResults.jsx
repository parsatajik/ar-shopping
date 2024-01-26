// TODO: check for negative prices
// TODO: ensure correct display for pricing

import React, { Suspense } from "react";
import LOGO from "../logo.svg";

const Loading = () => (
  <div className="animate-pulse flex flex-row gap-4 bg-white shadow-md rounded px-6 pt-4 pb-6 mb-4 relative transform transition duration-500">
    <div className="w-1/4 h-32 bg-gray-300 rounded"></div>
    <div className="w-3/4 space-y-4 py-1">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
    </div>
  </div>
);

const Result = ({ title, price, link, image_url, supports_bnpl }) => (
  <div className="flex flex-row gap-4 bg-white shadow-md rounded px-6 pt-4 pb-6 mb-4 relative transform transition duration-500 hover:scale-105">
    {supports_bnpl && (
      <img
        src={LOGO}
        alt="Supports BNPL"
        className="absolute top-2 right-2 h-7 w-7"
      />
    )}
    <div className="w-1/4">
      <img src={image_url} alt={title} className="w-full" />
    </div>
    <div className="w-3/4">
      <h4 className="text-gray-700 text-lg font-semibold mr-4">{title}</h4>
      <p className="text-gray-500 mt-3">${price}</p>
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 hover:text-blue-700 transition duration-500 hover:underline"
      >
        View Product
      </a>
    </div>
  </div>
);

const SearchResults = ({ results, selectedFile, isLoading }) => {
  if (results) {
    return (
      <>
        <h3 className="text-gray-700 text-lg font-semibold mb-4">Results</h3>
        {results.map((result, index) => (
          <Result {...result} />
        ))}
      </>
    );
  } else if (isLoading) {
    return (
      <>
        <h3 className="text-gray-700 text-lg font-semibold mb-4">Results</h3>
        {[...Array(5)].map((_, index) => (
          <Loading key={index} />
        ))}
      </>
    );
  } else if (selectedFile) {
    return (
      <>
        <h3 className="text-gray-700 text-lg font-semibold mb-4">Results</h3>
        <p className="text-gray-500 mt-3">No results found.</p>
      </>
    );
  } else {
    return (
      <>
        <h3 className="text-gray-700 text-lg font-semibold mb-4">Results</h3>
        <p className="text-gray-500 mt-3">
          Please upload or capture your product's image 😊
        </p>
      </>
    );
  }
};

export default SearchResults;
