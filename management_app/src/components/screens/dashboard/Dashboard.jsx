import React, { useState } from 'react';
import TopNavbar from '../navigations/TopNavbar';
import Sidebar from '../navigations/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Project from '../main/Project';
import Milestone from '../main/Milestone';
import Tasks from '../main/Tasks';
import Organization from '../main/Organization';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'} md:ml-64`}>
        <TopNavbar toggleSidebar={toggleSidebar} />
        <div className="mt-16 p-4">
          <Routes>
            <Route path="/dashboard/projects" element={<Project />} />
            <Route path="/dashboard/milestones" element={<Milestone />} />
            <Route path="/dashboard/tasks" element={<Tasks />} />
            <Route path="/dashboard/organizations" element={<Organization />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
