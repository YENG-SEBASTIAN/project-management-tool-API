import React, { useState } from 'react';
import TopNavbar from '../navigations/TopNavbar';
import Sidebar from '../navigations/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Project from '../main/Project';
import Milestone from '../main/Milestone';
import Tasks from '../main/Tasks';
import Organization from '../main/Organization';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <TopNavbar isSidebarOpen={isSidebarOpen} />
        <div className="mt-16 p-4">
          <Routes>
            <Route path="projects" element={<Project />} />
            <Route path="milestones" element={<Milestone />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="organizations" element={<Organization />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
