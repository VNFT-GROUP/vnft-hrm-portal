/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingPage from '../components/custom/LoadingPage/LoadingPage';
import { useAuthStore } from '@/store/useAuthStore';
import { getGatewayLoginUrl } from '@/config/portal.config';

// Public verify page
const VerifyPage = lazy(() => import('../pages/verify/VerifyPage'));

const AppLayout      = lazy(() => import('../pages/app/AppLayout'));
const DashboardPage  = lazy(() => import('../pages/app/DashboardPage'));
const CustomersPage  = lazy(() => import('../pages/app/customers/CustomersPage'));
const OrdersPage     = lazy(() => import('../pages/app/orders/OrdersPage'));
const ShipmentsPage  = lazy(() => import('../pages/app/shipments/ShipmentsPage'));
const OperationsPage = lazy(() => import('../pages/app/operations/OperationsPage'));
const FinancePage    = lazy(() => import('../pages/app/finance/FinancePage'));
const ReportsPage    = lazy(() => import('../pages/app/reports/ReportsPage'));
const SettingsPage   = lazy(() => import('../pages/app/settings/SettingsPage'));
const UserGuidePage  = lazy(() => import('../pages/app/user-guide/UserGuidePage'));

/**
 * Auth guard component - redirects to gateway if not authenticated.
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    window.location.href = getGatewayLoginUrl();
    return <LoadingPage message="Đang chuyển hướng..." />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  // Public verify route — checks auth cookie and redirects
  {
    path: '/verify',
    element: (
      <Suspense fallback={<LoadingPage message="Đang xác thực..." />}>
        <VerifyPage />
      </Suspense>
    ),
  },
  {
    path: '/app',
    element: (
      <AuthGuard>
        <Suspense fallback={<LoadingPage message="Khởi tạo CRM Workspace..." />}><AppLayout /></Suspense>
      </AuthGuard>
    ),
    children: [
      { index: true,                          element: <DashboardPage />  },
      // Customers
      { path: 'customers',                    element: <CustomersPage />  },
      { path: 'customers/leads',              element: <CustomersPage />  },
      { path: 'customers/contacts',           element: <CustomersPage />  },
      { path: 'customers/contracts',          element: <CustomersPage />  },
      // Orders
      { path: 'orders',                       element: <OrdersPage />     },
      { path: 'orders/pending',               element: <OrdersPage />     },
      { path: 'orders/active',                element: <OrdersPage />     },
      { path: 'orders/done',                  element: <OrdersPage />     },
      { path: 'orders/cancelled',             element: <OrdersPage />     },
      // Shipments
      { path: 'shipments',                    element: <ShipmentsPage />  },
      { path: 'shipments/export',             element: <ShipmentsPage />  },
      { path: 'shipments/import',             element: <ShipmentsPage />  },
      { path: 'shipments/port',               element: <ShipmentsPage />  },
      { path: 'shipments/history',            element: <ShipmentsPage />  },
      // Operations
      { path: 'operations',                   element: <OperationsPage /> },
      { path: 'operations/schedule',          element: <OperationsPage /> },
      { path: 'operations/vehicles',          element: <OperationsPage /> },
      { path: 'operations/drivers',           element: <OperationsPage /> },
      { path: 'operations/ports',             element: <OperationsPage /> },
      { path: 'operations/warehouses',        element: <OperationsPage /> },
      // Finance
      { path: 'finance',                      element: <FinancePage />    },
      { path: 'finance/invoices',             element: <FinancePage />    },
      { path: 'finance/payments',             element: <FinancePage />    },
      { path: 'finance/debts',                element: <FinancePage />    },
      { path: 'finance/quotes',              element: <FinancePage />    },
      // Reports
      { path: 'reports',                      element: <ReportsPage />    },
      { path: 'reports/revenue',              element: <ReportsPage />    },
      { path: 'reports/kpi',                  element: <ReportsPage />    },
      { path: 'reports/trade',                element: <ReportsPage />    },
      { path: 'reports/customers',            element: <ReportsPage />    },
      // Settings
      { path: 'settings',                     element: <SettingsPage />   },
      // User Guide
      { path: 'user-guide',                   element: <UserGuidePage />  },
    ]
  },
  {
    path: '*',
    element: <Navigate to="/verify" replace />
  }
]);
