import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuthRedirect = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
      if (token) {

        const timer = setTimeout(() => {
          navigate(-1);
        }, 3000);

        return () => clearTimeout(timer); // Clear timeout if component unmounts
      }
    }, [token, navigate]);

    return (
      <>
        <WrappedComponent {...props} />
      </>
    );
  };
};

export default withAuthRedirect;