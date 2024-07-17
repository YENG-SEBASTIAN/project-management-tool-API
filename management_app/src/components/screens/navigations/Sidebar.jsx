import React from 'react';
import { Link } from 'react-router-dom';
import { FiClipboard, FiFlag, FiCheckSquare, FiBriefcase, FiBarChart } from 'react-icons/fi';

const Sidebar = ({ isOpen }) => {
  return (
    <nav className={`bg-orange-800 text-white h-full fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-0'} md:w-64`}>
      <div className="p-4">
        <h2 className="text-xl font-bold">Management Tool</h2>
      </div>
      <div className="flex flex-col mt-5 justify-between flex-1">
        <div className="p-4">
          <ul>
          <li>
              <Link to="/dashboard/organizations" className="flex items-center py-2">
                <FiBriefcase className="mr-2" /> Organizations
              </Link>
            </li>
            <li>
              <Link to="/dashboard/projects" className="flex items-center py-2">
                <FiClipboard className="mr-2" /> Projects
              </Link>
            </li>
            <li>
              <Link to="/dashboard/milestones" className="flex items-center py-2">
                <FiFlag className="mr-2" /> Milestones
              </Link>
            </li>
            <li>
              <Link to="/dashboard/tasks" className="flex items-center py-2">
                <FiCheckSquare className="mr-2" /> Tasks
              </Link>
            </li>
            <li>
              <Link to="/dashboard/progress" className="flex items-center py-2">
                <FiBarChart className="mr-2" /> Progress
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
