// src/components/GoogleButton.jsx
import React from "react";

const GoogleButton = ({ text = "Continue with Google", onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 bg-white text-gray-700 font-medium shadow-sm hover:shadow-md hover:bg-gray-50 transition"
    >
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="Google"
        className="w-5 h-5"
      />
      {text}
    </button>
  );
};

export default GoogleButton;
