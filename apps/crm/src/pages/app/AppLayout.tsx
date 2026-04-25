import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import LoadingPage from '../../components/custom/LoadingPage/LoadingPage';
import CRMHeader from './layout/components/CRMHeader/CRMHeader';
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <div className="crm-app-layout">
      <CRMHeader />
      <main className="crm-app-main">
        <Suspense fallback={<LoadingPage message="Tải phân hệ..." />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
