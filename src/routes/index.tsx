import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const LoginPage = lazy(() => import("../pages/public-routes/login/LoginPage"));
const AppLayout = lazy(() => import("../pages/app-routes/layout/AppLayout"));
const DashboardPage = lazy(() => import("../pages/app-routes/dashboard/DashboardPage"));

// Dynamic Imports
const ProfilePage = lazy(() => import("../pages/app-routes/profile"));
const CalendarPage = lazy(() => import("../pages/app-routes/calendar"));
const EmployeesPage = lazy(() => import("../pages/app-routes/management/employees"));
const DepartmentsPage = lazy(() => import("../pages/app-routes/management/departments"));
const RolesPage = lazy(() => import("../pages/app-routes/management/roles"));
const AttendancePage = lazy(() => import("../pages/app-routes/management/attendance"));
const EvaluationCriteriaPage = lazy(() => import("../pages/app-routes/management/evaluation-criteria"));
const PermissionsPage = lazy(() => import("../pages/app-routes/management/permissions"));
const ContractsPage = lazy(() => import("../pages/app-routes/management/contracts"));
const EvaluationPage = lazy(() => import("../pages/app-routes/evaluation"));
const ProfitReportPage = lazy(() => import("../pages/app-routes/acc/profit-report"));
const VotingPage = lazy(() => import("../pages/app-routes/voting"));
const RequestsPage = lazy(() => import("../pages/app-routes/requests"));
const FinanceReportsPage = lazy(() => import("../pages/app-routes/finance/reports"));
const ReportsPage = lazy(() => import("../pages/app-routes/reports"));
const SettingsPage = lazy(() => import("../pages/app-routes/settings"));
const ActivityLogsPage = lazy(() => import("../pages/app-routes/activity-logs"));
const UserGuidePage = lazy(() => import("../pages/app-routes/user-guide"));


import LoadingPage from "../components/custom/loadingPage/LoadingPage";

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingPage duration={100} message="Loading module..." />}>
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
    </Suspense>
  );
}
