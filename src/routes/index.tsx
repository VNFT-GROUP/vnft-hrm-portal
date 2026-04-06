import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/public-routes/login/LoginPage";
import AppLayout from "../pages/app-routes/layout/AppLayout";
import DashboardPage from "../pages/app-routes/dashboard/DashboardPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
