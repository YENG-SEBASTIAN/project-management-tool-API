import React, { useState } from "react";
import TopNavbar from "../navigations/TopNavbar";
import Sidebar from "../navigations/Sidebar";
import { Route, Routes } from "react-router-dom";
import Project from "../main/Project";
import Milestone from "../main/Milestone";
import MilestoneDetail from "../main/MilestoneDetail";
import Tasks from "../main/Tasks";
import TaskDetail from "../main/TaskDetail";
import Organization from "../main/Organization";
import OrganizationDetail from "../main/OrganizationDetail";
import Progress from "../main/Progress";
import ProtectedRoute from "../../auth/ProtectedRoute";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >
        <TopNavbar toggleSidebar={toggleSidebar} />
        <div className="mt-16 p-4">
          <Routes>
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Project />
                </ProtectedRoute>
              }
            />
            <Route
              path="/milestones"
              element={
                <ProtectedRoute>
                  <Milestone />
                </ProtectedRoute>
              }
            />
            <Route
              path="/milestone/:id"
              element={
                <ProtectedRoute>
                  <MilestoneDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
              <Route
              path="/tasks/:id"
              element={
                <ProtectedRoute>
                  <TaskDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizations"
              element={
                <ProtectedRoute>
                  <Organization />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organization/:id"
              element={
                <ProtectedRoute>
                  <OrganizationDetail />
                </ProtectedRoute>
              }
            />
              <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
