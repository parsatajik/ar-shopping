import React from "react";
import { useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
      <h1 className="text-4xl text-red-600">Oops!</h1>
      <p className="text-2xl text-gray-700 mt-4">Sorry, an unexpected error has occurred.</p>
      <p className="text-lg text-gray-500 mt-4">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

export default Error;