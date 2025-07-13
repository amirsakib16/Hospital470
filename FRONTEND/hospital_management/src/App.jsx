import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import RoleSelect from "./components/RoleSelect";
import PatientDashboard from "./components/PatientDashboard";
import DoctorAppoinment from "./components/DoctorAppoinment";
const App = () => {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/about" element={<About />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pdash" element={<PatientDashboard />} />
        <Route path="/dapp" element={<DoctorAppoinment />} />
      </Routes>
    </Router>
  );
};

export default App;
