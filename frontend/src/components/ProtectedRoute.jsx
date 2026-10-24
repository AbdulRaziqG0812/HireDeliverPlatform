import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const isLoggedIn =
    localStorage.getItem("hireDeliverLoggedIn") === "true";

  const savedUser = localStorage.getItem("hireDeliverUser");

  const user = savedUser
    ? JSON.parse(savedUser)
    : null;

  // Not logged in
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role protection
  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;