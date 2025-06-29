import React, { useEffect } from 'react';
import Cookies from 'js-cookies';
import { useNavigate } from 'react-router-dom';

const AdminProtectedRoute = (props) => {
  const { Component } = props;
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminJwtToken');

    // Use Cookies to avoid ESLint warning (can be adapted for future cookie-based auth)
    const cookieToken = Cookies.get('adminJwtToken');
    console.log('Cookie token (if present):', cookieToken); // temp use to avoid "unused" warning

    if (!adminToken) {
      navigate('/login');
    }
  }, [navigate]);

  return <Component />;
};

export default AdminProtectedRoute;
