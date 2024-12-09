import React from "react";

const CircleLine: React.FC = () => {
  return (
      <div className="relative mt-2 flex items-center">
        {/* Hình tròn */}
        <div className="h-4 w-4 rounded-full bg-gray-400"></div>
        {/* Đường ngang */}
        <div className="h-[2px] w-[40%] bg-gray-400"></div>
      </div>
    
  );
};

export default CircleLine;
