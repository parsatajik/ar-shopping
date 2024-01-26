import React from "react";

const ImageUploader = ({ handleFileChange }) => {
  return (
    <div className="w-full">
      <div className="bg-white shadow-md rounded px-6 pt-4 pb-6 mb-4">
        <label className="block">
          <span className="sr-only">Upload your photo</span>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="block w-full text-sm text-gray-500
                    file:me-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700
                    file:disabled:opacity-50 file:disabled:pointer-events-none
                    dark:file:bg-primary-base
                    dark:hover:file:bg-primary-dark
                    dark:file:text-sm
            "
          />
        </label>
      </div>
    </div>
  );
};

export default ImageUploader;
