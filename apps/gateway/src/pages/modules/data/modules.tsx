import type { ReactNode } from "react";
import { Users, Handshake, Truck, BarChart3, IdCard } from "lucide-react";
import { moduleUrlMap } from "@/config/portal.config";

export interface ModuleConfig {
  id: string;
  name: string;
  nameFull: string;
  description: string;
  icon: ReactNode;
  color: string;
  url: string;
  status: "active" | "maintenance";
  features: string[];
  image: string;
}

export const modules: ModuleConfig[] = [
  {
    id: "hrm",
    name: "HRM",
    nameFull: "Human Resource Management",
    description: "Quản lý nhân sự, chấm công, tính lương và đánh giá hiệu suất nhân viên.",
    icon: <Users size={24} strokeWidth={1.5} />,
    color: "#2E3192",
    url: moduleUrlMap.hrm,
    status: "active",
    features: ["Quản lý nhân viên", "Chấm công", "Bảng lương", "Đánh giá"],
    image: "/common/hrm.jpg",
  },
  {
    id: "crm",
    name: "CRM",
    nameFull: "Customer Relationship Management",
    description: "Quản lý khách hàng, đơn hàng, vận đơn và chăm sóc khách hàng.",
    icon: <Handshake size={24} strokeWidth={1.5} />,
    color: "#0EA5E9",
    url: moduleUrlMap.crm,
    status: "maintenance",
    features: ["Khách hàng", "Đơn hàng", "Vận đơn", "Báo cáo"],
    image: "/common/crm.jpg",
  },
  {
    id: "fms",
    name: "FMS",
    nameFull: "Fleet Management System",
    description: "Quản lý đội xe, lộ trình vận chuyển, bảo trì và chi phí vận hành.",
    icon: <Truck size={24} strokeWidth={1.5} />,
    color: "#F7941D",
    url: moduleUrlMap.fms,
    status: "maintenance",
    features: ["Đội xe", "Lộ trình", "Bảo trì", "Chi phí"],
    image: "/common/fms.jpg",
  },
  {
    id: "finance",
    name: "Finance",
    nameFull: "Financial Management",
    description: "Phân tích dữ liệu tổng hợp, báo cáo kinh doanh và dự báo xu hướng.",
    icon: <BarChart3 size={24} strokeWidth={1.5} />,
    color: "#8B5CF6",
    url: moduleUrlMap.finance,
    status: "maintenance",
    features: ["Dashboard", "Báo cáo", "Dự báo", "KPI"],
    image: "/common/fin.png",
  },
  {
    id: "namecard",
    name: "Namecard",
    nameFull: "Digital Namecard",
    description: "Quản lý danh thiếp điện tử thông minh, chia sẻ thông tin liên hệ và mã QR cá nhân.",
    icon: <IdCard size={24} strokeWidth={1.5} />,
    color: "#E11D48",
    url: moduleUrlMap.namecard,
    status: "maintenance",
    features: [],
    image: "/common/namecard.jpg",
  },
];
