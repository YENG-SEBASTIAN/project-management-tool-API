import React, { useState } from 'react';
import TopNavbar from '../navigations/TopNavbar';
import Sidebar from '../navigations/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Project from '../main/Project';
import Milestone from '../main/Milestone';
import MilestoneDetail from '../main/MilestoneDetail';
import Tasks from '../main/Tasks';
import Organization from '../main/Organization';
import OrganizationDetail from '../main/OrganizationDetail';

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
            <Route path="/projects" element={<Project />} />
            <Route path="/milestones" element={<Milestone />} />
            <Route path="/milestone/:id" component={MilestoneDetail} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/organizations" element={<Organization />} />
            <Route path="/organization/:id" element={<OrganizationDetail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
