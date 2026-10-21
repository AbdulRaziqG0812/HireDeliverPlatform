import { Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Hire from "./pages/Hire";
import Deliver from "./pages/Deliver";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import "./App.css";

function App() {
  return (
    <div className="app">

      <Routes>

        <Route path="/" element={<Welcome />} />

        <Route path="/home" element={<Home />} />

        <Route path="/hire" element={<Hire />} />

        <Route path="/deliver" element={<Deliver />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

      </Routes>

    </div>
  );
}

export default App;