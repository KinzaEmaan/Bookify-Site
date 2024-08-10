import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import Logins from "./login/Logins";
import Signups from "./signup/Signups";
import Dashboard from "./components/Dashboard";
import ForgotPasswordModal from "./components/ForgotPasswordModal";



function App() {
  return (
    <div className="dark:bg-slate-900 dark:text-white">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Logins />} />
      <Route path="/signup" element={<Signups />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/forgot-password" element={<ForgotPasswordModal />} />
      <Route path="/logout" element={<Dashboard />} />
      <Route path="/reset-password" element={<ForgotPasswordModal />} />
    </Routes>
    </div>
  );
}

export default App;
