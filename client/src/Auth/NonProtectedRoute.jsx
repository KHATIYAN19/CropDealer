import { Navigate } from "react-router-dom";

const NonProtectedRoute = ({ isAuthenticated, children }) => {
    return isAuthenticated ? <Navigate to="/" /> : children;
};

export default NonProtectedRoute;
