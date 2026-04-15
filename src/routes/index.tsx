import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const LoginPage = lazy(() => import("../pages/public-routes/login/LoginPage"));
const NetworkPage = lazy(() => import("../pages/public-routes/network/NetworkPage"));
const AppLayout = lazy(() => import("../pages/app-routes/layout/AppLayout"));

// Dynamic Imports for Inner Pages
const HomePage = lazy(() => import("../pages/app-routes/dashboard/HomePage"));
const ProfilePage = lazy(() => import("../pages/app-routes/profile"));
const EditProfilePage = lazy(() => import("../pages/app-routes/profile/edit"));
const EmployeesPage = lazy(() => import("../pages/app-routes/management/employees"));
const DepartmentsPage = lazy(() => import("../pages/app-routes/management/departments"));
const PositionsPage = lazy(() => import("../pages/app-routes/management/positions"));
const EmployeeCodesPage = lazy(() => import("../pages/app-routes/management/employee-codes"));
const GroupsPage = lazy(() => import("../pages/app-routes/management/groups"));
const RolesPage = lazy(() => import("../pages/app-routes/management/roles"));
const ManagementAttendancePage = lazy(() => import("../pages/app-routes/management/attendance"));
const TimeSettingsPage = lazy(() => import("../pages/app-routes/management/time-settings"));
const MyAttendancePage = lazy(() => import("../pages/app-routes/attendance"));
const EvaluationPage = lazy(() => import("../pages/app-routes/evaluation"));
const ProfitReportPage = lazy(() => import("../pages/app-routes/acc/profit-report"));
const VotingPage = lazy(() => import("../pages/app-routes/voting"));
const RequestsPage = lazy(() => import("../pages/app-routes/requests"));
const CreateRequestPage = lazy(() => import("../pages/app-routes/requests/create/index"));
const FinanceReportsPage = lazy(() => import("../pages/app-routes/finance/reports"));
const ReportsPage = lazy(() => import("../pages/app-routes/reports"));
const SettingsPage = lazy(() => import("../pages/app-routes/settings"));
const ActivityLogsPage = lazy(() => import("../pages/app-routes/activity-logs"));
const UserGuidePage = lazy(() => import("../pages/app-routes/user-guide"));

import LoadingPage from "../components/custom/loadingPage/LoadingPage";
import { useAuthStore } from "@/store/useAuthStore";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/app" replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Suspense fallback={<LoadingPage message="Khởi tạo hệ thống..." />}>
              <LoginPage />
            </Suspense>
          </PublicRoute>
        } 
      />
      <Route 
        path="/network" 
        element={
          <Suspense fallback={<LoadingPage message="Kết nối mạng lưới VNFT..." />}>
            <NetworkPage />
          </Suspense>
        } 
      />
      <Route 
        path="/app" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingPage message="Tải phân hệ máy chủ..." />}>
              <AppLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
          {/* Dashboard (Home) */}
          <Route index element={<HomePage />} />
          
          {/* Core Menu */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<EditProfilePage />} />
          <Route path="attendance" element={<MyAttendancePage />} />
          <Route path="evaluation" element={<EvaluationPage />} />
          <Route path="voting" element={<VotingPage />} />
          <Route path="requests">
             <Route index element={<RequestsPage />} />
             <Route path="create" element={<CreateRequestPage />} />
          </Route>
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="activity-logs" element={<ActivityLogsPage />} />
          <Route path="user-guide" element={<UserGuidePage />} />

          {/* Cấp 2: Quản lý */}
          <Route path="management">
             <Route path="employees" element={<EmployeesPage />} />
             <Route path="departments" element={<DepartmentsPage />} />
             <Route path="positions" element={<PositionsPage />} />
             <Route path="employee-codes" element={<EmployeeCodesPage />} />
             <Route path="groups" element={<GroupsPage />} />
             <Route path="roles" element={<RolesPage />} />
             <Route path="attendance" element={<ManagementAttendancePage />} />
             <Route path="time-settings" element={<TimeSettingsPage />} />
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
