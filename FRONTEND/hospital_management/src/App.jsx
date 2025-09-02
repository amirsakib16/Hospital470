import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import RoleSelect from "./components/RoleSelect";
import PatientDashboard from "./components/PatientDashboard";
import DoctorAppoinment from "./components/DoctorAppoinment";
import MedicineList from "./components/MedicineList";
import PatientLogin from './components/PatientLogin';
import DoctorList from "./components/DoctorList";
import PatientReg from "./components/PatientRegister";
import DoctorRecommendations from "./components/DoctorRecommendation";
const App = () => {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/about" element={<About />} />
        <Route path="/homepage" element={<Home />} />
        <Route path="/pdash" element={<PatientDashboard />} />
        <Route path="/dapp" element={<DoctorAppoinment />} />
        <Route path="/med" element={<MedicineList />} />
        <Route path="/patientLogin" element={<PatientLogin />} />
        <Route path="/alldoc" element={<DoctorList />} />
        <Route path="/preg" element={<PatientReg />} />
        <Route path="/docreco" element={<DoctorRecommendations />} />
      </Routes>
    </Router>
  );
};

export default App;
