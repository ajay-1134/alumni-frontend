import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="text-xl mt-2 text-gray-700">Oops! Page not found.</p>
      <p className="text-gray-500 mt-1">The page you are looking for doesn’t exist.</p>
      <Link
        to="/"
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
