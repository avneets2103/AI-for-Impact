import React, { useEffect, useState, useRef } from "react";
import SectionDisplay from "../sectionDisplay/sectionDisplay";

function SupportTop() {
  return (
    <div className="width-[100%] my-4 flex h-[7%] cursor-pointer items-center justify-between font-medium">
      <div className="flex gap-4">
        <SectionDisplay />
        <div className="flex items-center rounded-[10px] bg-color1">
        </div>
      </div>
    </div>
  );
}

export default SupportTop;
