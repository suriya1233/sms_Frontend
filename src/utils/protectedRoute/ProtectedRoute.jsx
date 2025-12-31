import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');

    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // If roles are specified and user's role is not included, redirect to login (or unauthorized page)
    if (allowedRoles && !allowedRoles.includes(role)) {
        // You could also redirect to a dedicated unauthorized page
        return <Navigate to="/" replace />;
    }

    // If authorized, render child routes
    return <Outlet />;
};

export default ProtectedRoute;
