import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    // Check if the user is authenticated

    const details = JSON.parse(window.localStorage.getItem('user-details'));
    console.log("inside protected", details)
    if (details !== null) {
        console.log("username from protected", details.username)
        console.log("logout from protected", details.logout)

        if (details.logout === 0) {
            // If the user is not authenticated, redirect to the /Error route
            return <Navigate to="/Error" replace />;

        }

    }
    else {
        return <Navigate to="/Error" replace />;
    }


    // If the user is authenticated, render the protected component
    return children;
};

export default ProtectedRoute;