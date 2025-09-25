import React from "react";

const Card = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
      {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
