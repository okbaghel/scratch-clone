import React from 'react';

const Navbar = ({ selectedObject, onSelectObject }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-b-xl shadow flex flex-col sm:flex-row items-center justify-between w-full gap-4 sm:gap-0">
      {/* Title */}
      <div className="text-white text-xl font-semibold text-center w-full sm:w-auto">
        ScratchAppClone
      </div>

      {/* Object Selector */}
      <div className="flex gap-2">
        <button
          className={`px-4 py-1 rounded-full text-sm sm:text-base ${
            selectedObject === 1
              ? 'bg-white text-black'
              : 'bg-gray-600 text-white hover:bg-gray-500'
          } transition`}
          onClick={() => onSelectObject(1)}
        >
          Monkey
        </button>
        <button
          className={`px-4 py-1 rounded-full text-sm sm:text-base ${
            selectedObject === 2
              ? 'bg-white text-black'
              : 'bg-gray-600 text-white hover:bg-gray-500'
          } transition`}
          onClick={() => onSelectObject(2)}
        >
          Banana
        </button>
      </div>
    </div>
  );
};

export default Navbar;
