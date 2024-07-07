import React, { useEffect } from 'react';

const Alert = ({ message, type }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Remove the alert after 5 seconds
      document.getElementById('alert').style.display = "none";
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const alertClassName = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div
      id="alert"
      className={`fixed top-0 right-0 m-4 p-4 ${alertClassName} text-white rounded shadow-lg z-50`}
    >
      {message}
    </div>
  );
};

export default Alert;
