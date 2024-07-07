import React, { useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useIdleTimer } from 'react-idle-timer';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const idleTimerRef = useRef(null);

  const handleOnIdle = () => {
    // If user is idle for 20 minutes, clear the token and navigate to login page
    if (token) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  useIdleTimer({
    ref: idleTimerRef,
    timeout: 20 * 60 * 1000, // 20 minutes in milliseconds
    onIdle: handleOnIdle,
    debounce: 500,
  });

  useEffect(() => {
    // Redirect to login page if token is not available
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
