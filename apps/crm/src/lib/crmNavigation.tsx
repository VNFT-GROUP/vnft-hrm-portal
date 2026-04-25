import {
  LayoutDashboard, Users, Package, Ship, Truck,
  DollarSign, BarChart2, Settings,
  UserPlus, Handshake, Contact,
  ClipboardList, Clock, CheckCircle, XCircle,
  Anchor, Warehouse, CalendarClock, Navigation,
  Receipt, CreditCard, TrendingUp, Calculator,
  PieChart, BarChart, ArrowUpDown, UserCheck,
} from "lucide-react";
import type { ReactNode } from "react";

export type CRMSubItem = {
  id: string;
  label: string;
  path: string;
  icon?: ReactNode;
};

export type CRMNavItem = {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
  subItems?: CRMSubItem[];
};

export const CRM_NAV: CRMNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/app",
    icon: <LayoutDashboard size={18} />,
  },
  {
    id: "customers",
    label: "Khách hàng",
    path: "/app/customers",
    icon: <Users size={18} />,
    subItems: [
      { id: "customers-list",      label: "Danh sách KH",   path: "/app/customers",          icon: <Users size={14} /> },
      { id: "customers-leads",     label: "Tiềm năng",      path: "/app/customers/leads",    icon: <UserPlus size={14} /> },
      { id: "customers-contacts",  label: "Liên hệ",        path: "/app/customers/contacts", icon: <Contact size={14} /> },
      { id: "customers-contracts", label: "Hợp đồng",       path: "/app/customers/contracts",icon: <Handshake size={14} /> },
    ],
  },
  {
    id: "orders",
    label: "Đơn hàng",
    path: "/app/orders",
    icon: <Package size={18} />,
    subItems: [
      { id: "orders-all",       label: "Tất cả đơn",    path: "/app/orders",              icon: <ClipboardList size={14} /> },
      { id: "orders-pending",   label: "Chờ xử lý",     path: "/app/orders/pending",      icon: <Clock size={14} /> },
      { id: "orders-active",    label: "Đang xử lý",    path: "/app/orders/active",       icon: <ArrowUpDown size={14} /> },
      { id: "orders-done",      label: "Hoàn thành",    path: "/app/orders/done",         icon: <CheckCircle size={14} /> },
      { id: "orders-cancelled", label: "Đã huỷ",        path: "/app/orders/cancelled",    icon: <XCircle size={14} /> },
    ],
  },
  {
    id: "shipments",
    label: "Lô hàng",
    path: "/app/shipments",
    icon: <Ship size={18} />,
    subItems: [
      { id: "shipments-active",  label: "Đang vận chuyển", path: "/app/shipments",          icon: <Ship size={14} /> },
      { id: "shipments-export",  label: "Xuất khẩu",       path: "/app/shipments/export",   icon: <ArrowUpDown size={14} /> },
      { id: "shipments-import",  label: "Nhập khẩu",       path: "/app/shipments/import",   icon: <ArrowUpDown size={14} /> },
      { id: "shipments-port",    label: "Tại cảng",         path: "/app/shipments/port",     icon: <Anchor size={14} /> },
      { id: "shipments-history", label: "Lịch sử",          path: "/app/shipments/history",  icon: <Clock size={14} /> },
    ],
  },
  {
    id: "operations",
    label: "Vận hành",
    path: "/app/operations",
    icon: <Truck size={18} />,
    subItems: [
      { id: "ops-schedule", label: "Lịch trình",   path: "/app/operations/schedule",  icon: <CalendarClock size={14} /> },
      { id: "ops-vehicles", label: "Phương tiện",  path: "/app/operations/vehicles",  icon: <Truck size={14} /> },
      { id: "ops-drivers",  label: "Tài xế",       path: "/app/operations/drivers",   icon: <Navigation size={14} /> },
      { id: "ops-ports",    label: "Cảng biển",    path: "/app/operations/ports",     icon: <Anchor size={14} /> },
      { id: "ops-warehouses",label: "Kho bãi",     path: "/app/operations/warehouses",icon: <Warehouse size={14} /> },
    ],
  },
  {
    id: "finance",
    label: "Tài chính",
    path: "/app/finance",
    icon: <DollarSign size={18} />,
    subItems: [
      { id: "fin-invoices",  label: "Hoá đơn",    path: "/app/finance/invoices",  icon: <Receipt size={14} /> },
      { id: "fin-payments",  label: "Thanh toán", path: "/app/finance/payments",  icon: <CreditCard size={14} /> },
      { id: "fin-debts",     label: "Công nợ",    path: "/app/finance/debts",     icon: <TrendingUp size={14} /> },
      { id: "fin-quotes",    label: "Báo giá",    path: "/app/finance/quotes",    icon: <Calculator size={14} /> },
    ],
  },
  {
    id: "reports",
    label: "Báo cáo",
    path: "/app/reports",
    icon: <BarChart2 size={18} />,
    subItems: [
      { id: "rpt-revenue",   label: "Doanh thu",       path: "/app/reports/revenue",   icon: <TrendingUp size={14} /> },
      { id: "rpt-kpi",       label: "KPI",             path: "/app/reports/kpi",       icon: <PieChart size={14} /> },
      { id: "rpt-trade",     label: "XNK",             path: "/app/reports/trade",     icon: <BarChart size={14} /> },
      { id: "rpt-customers", label: "Khách hàng",      path: "/app/reports/customers", icon: <UserCheck size={14} /> },
    ],
  },
  {
    id: "settings",
    label: "Cài đặt",
    path: "/app/settings",
    icon: <Settings size={18} />,
  },
];
