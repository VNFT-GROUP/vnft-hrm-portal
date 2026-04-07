import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Utility to enforce a minimum loading time so the truck animation can finish
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const lazyWithDelay = (importFunc: () => Promise<any>, delay = 2500) => {
  return lazy(async () => {
    const [module] = await Promise.all([
      importFunc(),
      new Promise((resolve) => setTimeout(resolve, delay)),
    ]);
    return module;
  });
};

const LoginPage = lazyWithDelay(() => import("../pages/public-routes/login/LoginPage"), 2000);
const NetworkPage = lazyWithDelay(() => import("../pages/public-routes/network/NetworkPage"), 1500);
const AppLayout = lazyWithDelay(() => import("../pages/app-routes/layout/AppLayout"), 2000);

// Dynamic Imports with short realistic delay for Inner Pages
const DashboardPage = lazyWithDelay(() => import("../pages/app-routes/dashboard/DashboardPage"), 600);
const ProfilePage = lazyWithDelay(() => import("../pages/app-routes/profile"), 600);
const CalendarPage = lazyWithDelay(() => import("../pages/app-routes/calendar"), 600);
const EmployeesPage = lazyWithDelay(() => import("../pages/app-routes/management/employees"), 600);
const DepartmentsPage = lazyWithDelay(() => import("../pages/app-routes/management/departments"), 600);
const RolesPage = lazyWithDelay(() => import("../pages/app-routes/management/roles"), 600);
const AttendancePage = lazyWithDelay(() => import("../pages/app-routes/management/attendance"), 600);
const EvaluationCriteriaPage = lazyWithDelay(() => import("../pages/app-routes/management/evaluation-criteria"), 600);
const PermissionsPage = lazyWithDelay(() => import("../pages/app-routes/management/permissions"), 600);
const ContractsPage = lazyWithDelay(() => import("../pages/app-routes/management/contracts"), 600);
const EvaluationPage = lazyWithDelay(() => import("../pages/app-routes/evaluation"), 600);
const ProfitReportPage = lazyWithDelay(() => import("../pages/app-routes/acc/profit-report"), 600);
const VotingPage = lazyWithDelay(() => import("../pages/app-routes/voting"), 600);
const RequestsPage = lazyWithDelay(() => import("../pages/app-routes/requests"), 600);
const FinanceReportsPage = lazyWithDelay(() => import("../pages/app-routes/finance/reports"), 600);
const ReportsPage = lazyWithDelay(() => import("../pages/app-routes/reports"), 600);
const SettingsPage = lazyWithDelay(() => import("../pages/app-routes/settings"), 600);
const ActivityLogsPage = lazyWithDelay(() => import("../pages/app-routes/activity-logs"), 600);
const UserGuidePage = lazyWithDelay(() => import("../pages/app-routes/user-guide"), 600);

import LoadingPage from "../components/custom/loadingPage/LoadingPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <Suspense fallback={<LoadingPage duration={2000} message="Khởi tạo hệ thống..." />}>
            <LoginPage />
          </Suspense>
        } 
      />
      <Route 
        path="/network" 
        element={
          <Suspense fallback={<LoadingPage duration={1500} message="Kết nối mạng lưới VNFT..." />}>
            <NetworkPage />
          </Suspense>
        } 
      />
      <Route 
        path="/app" 
        element={
          <Suspense fallback={<LoadingPage duration={2000} message="Tải phân hệ máy chủ..." />}>
            <AppLayout />
          </Suspense>
        }
      >
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
