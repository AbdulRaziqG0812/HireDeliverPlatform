import { Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Hire from "./pages/Hire";
import Deliver from "./pages/Deliver";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";


function App() {
  return (
    <div className="app">

      <Routes>

        {/* =================================================
            PUBLIC PAGES
        ================================================= */}

        <Route
          path="/"
          element={<Welcome />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =================================================
            NORMAL USER PAGES
        ================================================= */}

        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRole="user">
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hire"
          element={
            <ProtectedRoute allowedRole="user">
              <Hire />
            </ProtectedRoute>
          }
        />

        <Route
          path="/deliver"
          element={
            <ProtectedRoute allowedRole="user">
              <Deliver />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            ADMIN PAGE
        ================================================= */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </div>
  );
}

export default App;