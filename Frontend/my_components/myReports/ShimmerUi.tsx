"use client";
import React from "react";

const ShimmerUi = () => {
  return (
    <div className="flex space-x-6 ">
      {/* Shimmer Boxes */}
      <div className="w-40 h-40 bg-gradient-to-r from-gray-300 to-gray-400 animate-pulse rounded-lg"></div>
      <div className="w-40 h-40 bg-gradient-to-r from-gray-300 to-gray-400 animate-pulse rounded-lg"></div>
      <div className="w-40 h-40 bg-gradient-to-r from-gray-300 to-gray-400 animate-pulse rounded-lg"></div>
      <div className="w-40 h-40 bg-gradient-to-r from-gray-300 to-gray-400 animate-pulse rounded-lg"></div>
    </div>
  );
};

export default ShimmerUi;
