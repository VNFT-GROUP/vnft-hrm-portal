import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { getGatewayLoginUrl } from "@/lib/permission/portal.config";


const AppLayout = lazy(() => import("../pages/app-routes/layout/AppLayout"));

// Public verify page
const VerifyPage = lazy(() => import("../pages/verify/VerifyPage"));

// Dynamic Imports for Inner Pages
const HomePage = lazy(() => import("../pages/app-routes/dashboard/HomePage"));
const ProfilePage = lazy(() => import("../pages/app-routes/profile"));
const EditProfilePage = lazy(() => import("../pages/app-routes/profile/edit"));
const EmployeesPage = lazy(() => import("../pages/app-routes/management/employees"));
const DepartmentsPage = lazy(() => import("../pages/app-routes/management/departments"));
const PositionsPage = lazy(() => import("../pages/app-routes/management/positions"));
const EmployeeCodesPage = lazy(() => import("../pages/app-routes/management/employee-codes"));
const GroupsPage = lazy(() => import("../pages/app-routes/management/groups"));
const JobTitlesPage = lazy(() => import("../pages/app-routes/management/job-titles"));
const ManagementRequestsPage = lazy(() => import("../pages/app-routes/management/requests"));
const ManagementAttendancePage = lazy(() => import("../pages/app-routes/management/attendance"));
const ManagementPayrollPage = lazy(() => import("../pages/app-routes/management/payroll"));
const ServerSettingsPage = lazy(() => import("../pages/app-routes/management/server-settings"));
const PerformanceReviewsPage = lazy(() => import("../pages/app-routes/management/performance"));
const MyAttendancePage = lazy(() => import("../pages/app-routes/attendance"));
const ProfitReportPage = lazy(() => import("../pages/app-routes/acc/profit-report"));
const SalesmanMappingPage = lazy(() => import("../pages/app-routes/acc/profit-report/salesman-mappings"));
const RequestsPage = lazy(() => import("../pages/app-routes/requests"));
const CreateRequestPage = lazy(() => import("../pages/app-routes/requests/create/index"));
const ReportsPage = lazy(() => import("../pages/app-routes/reports"));
const SettingsPage = lazy(() => import("../pages/app-routes/settings"));
const ActivityLogsPage = lazy(() => import("../pages/app-routes/activity-logs"));
const UserGuidePage = lazy(() => import("../pages/app-routes/user-guide"));

import LoadingPage from "../components/custom/loadingPage/LoadingPage";
import { useAuthStore } from "@/store/useAuthStore";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = getGatewayLoginUrl();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoadingPage message="Đang chuyển hướng..." />;
  }

  return <>{children}</>;
}

/** Suspense wrapper for lazy-loaded child routes inside /app */
function Lazy({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#2E3192] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Đang tải trang...</span>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public verify route — checks auth cookie and redirects */}
      <Route
        path="/verify"
        element={
          <Suspense fallback={<LoadingPage message="Đang xác thực..." />}>
            <VerifyPage />
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
          <Route index element={<Lazy><HomePage /></Lazy>} />
          
          {/* Core Menu */}
          <Route path="profile" element={<Lazy><ProfilePage /></Lazy>} />
          <Route path="profile/edit" element={<Lazy><EditProfilePage /></Lazy>} />
          <Route path="attendance" element={<Lazy><MyAttendancePage /></Lazy>} />
          <Route path="requests">
             <Route index element={<Lazy><RequestsPage /></Lazy>} />
             <Route path="create" element={<Lazy><CreateRequestPage /></Lazy>} />
          </Route>
          <Route path="reports" element={<Lazy><ReportsPage /></Lazy>} />
          <Route path="settings" element={<Lazy><SettingsPage /></Lazy>} />
          <Route path="activity-logs" element={<Lazy><ActivityLogsPage /></Lazy>} />
          <Route path="user-guide" element={<Lazy><UserGuidePage /></Lazy>} />

          {/* Cấp 2: Quản lý */}
          <Route path="management">
             <Route path="employees" element={<Lazy><EmployeesPage /></Lazy>} />
             <Route path="departments" element={<Lazy><DepartmentsPage /></Lazy>} />
             <Route path="positions" element={<Lazy><PositionsPage /></Lazy>} />
             <Route path="employee-codes" element={<Lazy><EmployeeCodesPage /></Lazy>} />
             <Route path="groups" element={<Lazy><GroupsPage /></Lazy>} />
             <Route path="job-titles" element={<Lazy><JobTitlesPage /></Lazy>} />
             <Route path="requests" element={<Lazy><ManagementRequestsPage /></Lazy>} />
             <Route path="attendance" element={<Lazy><ManagementAttendancePage /></Lazy>} />
             <Route path="payroll" element={<Lazy><ManagementPayrollPage /></Lazy>} />
             <Route path="evaluation" element={<Lazy><PerformanceReviewsPage /></Lazy>} />
             <Route path="server-settings" element={<Lazy><ServerSettingsPage /></Lazy>} />
          </Route>

          {/* Cấp 2: ACC */}
          <Route path="acc">
             <Route path="profit-report" element={<Lazy><ProfitReportPage /></Lazy>} />
             <Route path="profit-report/salesman-mappings" element={<Lazy><SalesmanMappingPage /></Lazy>} />
          </Route>
        </Route>
        {/* Catch-all: redirect to /verify (public auth check) */}
        <Route path="*" element={<Navigate to="/verify" replace />} />
    </Routes>
  );
}
