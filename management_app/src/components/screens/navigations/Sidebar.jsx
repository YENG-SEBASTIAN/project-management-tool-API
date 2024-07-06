import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaProjectDiagram, FaFlag, FaTasks, FaBuilding } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <button onClick={toggleSidebar} className="md:hidden absolute top-4 left-4 z-20">
        {isOpen ? <FaTimes className="w-6 h-6 text-white" /> : <FaBars className="w-6 h-6 text-white" />}
      </button>
      <div className={`bg-orange-500 min-h-screen w-64 text-white fixed transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <nav className="mt-10">
          <ul>
            <li className="mb-4">
              <NavLink to="/dashboard/projects" className="flex items-center py-2 px-4 hover:bg-orange-600">
                <FaProjectDiagram className="mr-2" />
                Projects
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink to="/dashboard/milestones" className="flex items-center py-2 px-4 hover:bg-orange-600">
                <FaFlag className="mr-2" />
                Milestones
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink to="/dashboard/tasks" className="flex items-center py-2 px-4 hover:bg-orange-600">
                <FaTasks className="mr-2" />
                Tasks
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-full">
          <nav className="mb-10">
            <ul>
              <li className="mb-4">
                <NavLink to="/dashboard/organizations" className="flex items-center py-2 px-4 hover:bg-orange-600">
                  <FaBuilding className="mr-2" />
                  Organizations
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
