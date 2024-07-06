import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-orange-500 min-h-screen w-64 text-white fixed">
      <nav className="mt-10">
        <ul>
          <li className="mb-4">
            <NavLink to="/projects" activeClassName="font-bold" className="block py-2 px-4 hover:bg-orange-600">
              Projects
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink to="/milestones" activeClassName="font-bold" className="block py-2 px-4 hover:bg-orange-600">
              Milestones
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink to="/tasks" activeClassName="font-bold" className="block py-2 px-4 hover:bg-orange-600">
              Tasks
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="absolute bottom-0 w-full">
        <nav className="mb-10">
          <ul>
            <li className="mb-4">
              <NavLink to="/organizations" activeClassName="font-bold" className="block py-2 px-4 hover:bg-orange-600">
                Organizations
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
