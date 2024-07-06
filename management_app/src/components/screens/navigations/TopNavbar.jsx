import React, { useState } from 'react';
import { FiMenu, FiMaximize, FiUser } from 'react-icons/fi';
import { logout } from '../../../actions/authActions';
import { FiLogOut } from 'react-icons/fi';

const TopNavbar = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const handleLogout = () => {
    console.log('Logout');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-orange-900 text-white fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <button className="mr-4 md:hidden" onClick={toggleSidebar}>
            <FiMenu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Management Tool</h1>
        </div>
        <div className="flex items-center">
          <button className="mr-4 text-white" onClick={handleFullScreen}>
            <FiMaximize className="h-6 w-6" />
          </button>
          <div className="relative">
            <button className="text-white focus:outline-none" onClick={toggleDropdown}>
              <FiUser className="h-8 w-8 rounded-full" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2">
                <button onClick={handleLogout} className="block justify-center items-center flex w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200">
                <FiLogOut className="h-8 w-8 rounded-full" /> Logout 
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
