import React, { useState, useEffect, useRef } from "react";

const AvatarWithDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar */}
      <button
        className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden focus:outline-none ring-2 ring-offset-2 ring-blue-500"
        onClick={toggleDropdown}
      >
        <img
          src="https://via.placeholder.com/150" // Replace with your avatar URL
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </button>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-2 px-4 text-gray-700">
            <p className="font-bold">John Doe</p>
            <p className="text-sm">john.doe@example.com</p>
          </div>
          <div className="border-t border-gray-200">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => alert("View Profile clicked")}
            >
              View Profile
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => alert("Logout clicked")}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarWithDropdown;
