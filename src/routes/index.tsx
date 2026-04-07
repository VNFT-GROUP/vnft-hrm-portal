import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/public-routes/login/LoginPage";
import AppLayout from "../pages/app-routes/layout/AppLayout";
import DashboardPage from "../pages/app-routes/dashboard/DashboardPage";

// Dynamic Imports
import ProfilePage from "../pages/app-routes/profile";
import CalendarPage from "../pages/app-routes/calendar";
import EmployeesPage from "../pages/app-routes/management/employees";
import DepartmentsPage from "../pages/app-routes/management/departments";
import RolesPage from "../pages/app-routes/management/roles";
import AttendancePage from "../pages/app-routes/management/attendance";
import EvaluationCriteriaPage from "../pages/app-routes/management/evaluation-criteria";
import PermissionsPage from "../pages/app-routes/management/permissions";
import ContractsPage from "../pages/app-routes/management/contracts";
import EvaluationPage from "../pages/app-routes/evaluation";
import ProfitReportPage from "../pages/app-routes/acc/profit-report";
import VotingPage from "../pages/app-routes/voting";
import RequestsPage from "../pages/app-routes/requests";
import FinanceReportsPage from "../pages/app-routes/finance/reports";
import ReportsPage from "../pages/app-routes/reports";
import SettingsPage from "../pages/app-routes/settings";
import ActivityLogsPage from "../pages/app-routes/activity-logs";
import UserGuidePage from "../pages/app-routes/user-guide";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app" element={<AppLayout />}>
        {/* Dashboard */}
        <Route index element={<DashboardPage />} />
        
        {/* Core Menu */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="evaluation" element={<EvaluationPage />} />
        <Route path="voting" element={<VotingPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="activity-logs" element={<ActivityLogsPage />} />
        <Route path="user-guide" element={<UserGuidePage />} />

        {/* Cấp 2: Quản lý */}
        <Route path="management">
           <Route path="employees" element={<EmployeesPage />} />
           <Route path="departments" element={<DepartmentsPage />} />
           <Route path="roles" element={<RolesPage />} />
           <Route path="attendance" element={<AttendancePage />} />
           <Route path="evaluation-criteria" element={<EvaluationCriteriaPage />} />
           <Route path="permissions" element={<PermissionsPage />} />
           <Route path="contracts" element={<ContractsPage />} />
        </Route>

        {/* Cấp 2: ACC */}
        <Route path="acc">
           <Route path="profit-report" element={<ProfitReportPage />} />
        </Route>

        {/* Cấp 2: Tài chính */}
        <Route path="finance">
           <Route path="reports" element={<FinanceReportsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
