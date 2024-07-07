import React, { useEffect } from 'react';

const Alert = ({ message, type }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Remove the alert after 5 seconds
      document.getElementById('alert').style.display = "none";
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="alert"
      className={`fixed top-0 right-0 m-4 p-4 bg-${type === 'success' ? 'green' : 'red'}-500 text-white rounded shadow-lg z-50`}
    >
      {message}
    </div>
  );
};

export default Alert;
