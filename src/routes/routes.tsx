
import { PrivateRoute } from "./PrivateRoutes";
import {Routes, Route } from "react-router-dom";
import Dashboard from "@/dashboard/Dashboard";
import Reports from "@/reports/Reports";
import Login from "@/login/Login"

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}
