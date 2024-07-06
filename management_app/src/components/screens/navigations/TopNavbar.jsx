import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaExpandArrowsAlt } from 'react-icons/fa';
import { logout } from '../../../actions/authActions';
import { useNavigate } from 'react-router-dom';

const TopNavbar = ({ isSidebarOpen }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className={`flex justify-between items-center bg-white shadow-md p-4 fixed w-full ${isSidebarOpen ? 'md:w-[calc(100%-16rem)]' : 'w-full'} ml-${isSidebarOpen ? '64' : '0'} z-10 transition-all duration-300 ease-in-out`}>
      <div className="text-xl font-bold flex items-center">
        Project Management Tool
        <span className="ml-5 text-sm text-gray-600">Number of projects: 5</span>
      </div>
      <div className="flex items-center">
        <button onClick={handleFullScreen} className="mr-4 hidden md:block">
          <FaExpandArrowsAlt className="w-6 h-6 text-gray-700" />
        </button>
        <div className="relative">
          <img
            src={user?.avatar || 'https://via.placeholder.com/40'}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
