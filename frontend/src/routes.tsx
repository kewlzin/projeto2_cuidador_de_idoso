import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Caregivers from "./pages/Caregivers";
import ScheduleAppointment from "./pages/ScheduleAppointment";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/caregivers" element={<Caregivers />} />
      <Route path="/schedule/:caregiverId" element={<ScheduleAppointment />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 