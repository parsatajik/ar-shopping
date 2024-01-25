import React from "react";
import LOGO from "../logo.svg";

const SearchResults = ({ results }) => {
  return results ? (
    <>
      <h3 className="text-gray-700 text-lg font-semibold mb-4">Results</h3>
      {results.map(({ title, price, link, img, supports_bnpl }, index) => (
        <div
          key={`result-${index}`}
          className="flex flex-row gap-4 bg-white shadow-md rounded px-6 pt-4 pb-6 mb-4 relative transform transition duration-500 hover:scale-105"
        >
          {supports_bnpl && (
            <img
              src={LOGO}
              alt="Supports BNPL"
              className="absolute top-2 right-2 h-7 w-7"
            />
          )}
          <div className="w-1/4">
            <img src={img} alt={title} className="w-full" />
          </div>
          <div className="w-3/4">
            <h4 className="text-gray-700 text-lg font-semibold">{title}</h4>
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
      ))}
    </>
  ) : (
    <>
      <h3 className="text-gray-700 text-lg font-semibold mb-4">Results</h3>
      <p className="text-gray-500 mt-3">No results found.</p>
    </>
  );
};

export default SearchResults;
