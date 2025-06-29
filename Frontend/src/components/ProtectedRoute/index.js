import React, { useEffect } from 'react';
import Cookies from 'js-cookies';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = (props) => {
    const { Component } = props;
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.getItem('jwtToken');
        const adminToken = Cookies.getItem('adminJwtToken'); // eslint-disable-line no-unused-vars

        if (!token) {
            navigate('/login');
        }
    }, [navigate]); // added dependency to avoid missing dependency warning

    return <Component />;
};

export default ProtectedRoute;
