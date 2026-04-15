import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Home,
  UserCircle,
  Calendar,
  FolderOpen,
  Users,
  Building2,
  Briefcase,
  FileText,
  CheckSquare,
  Layers,
  FileEdit,
  Clock,
  Settings,
} from "lucide-react";

export const useNavigationData = () => {
  const { session } = useAuthStore();
  const { t } = useTranslation();

  const sidebarData = [
    {
      section: "",
      items: [
        {
          id: "dashboard",
          label: t("sidebar.dashboard", { defaultValue: "Trang chủ" }),
          shortName: t("sidebar.dashboardShort", { defaultValue: "Home" }),
          path: "/app",
          icon: <Home size={20} />,
        },
        {
          id: "profile",
          label: t("sidebar.profile", { defaultValue: "Hồ sơ" }),
          shortName: t("sidebar.profileShort", { defaultValue: "Hồ sơ NV" }),
          path: "/app/profile",
          icon: (
            <div className="relative">
              <UserCircle size={20} />
              {session?.requiredProfileCompleted === false && (
                <>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-80"></span>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1E2062]"></span>
                </>
              )}
            </div>
          ),
        },
        {
          id: "myAttendance",
          label: t("sidebar.myAttendance", { defaultValue: "Bảng công của tôi" }),
          shortName: t("sidebar.myAttendanceShort", { defaultValue: "Chấm công" }),
          path: "/app/attendance",
          icon: <Clock size={20} />,
        },
        {
          id: "requests",
          label: t("sidebar.requests", { defaultValue: "Đơn từ" }),
          shortName: t("sidebar.requestsShort", { defaultValue: "Đơn từ" }),
          path: "/app/requests",
          icon: <FileEdit size={20} />,
        },
        ...(session?.groupName === "ADMIN"
          ? [
              {
                id: "management",
                label: t("sidebar.management", { defaultValue: "Quản lý nhân sự" }),
                shortName: t("sidebar.managementShort", { defaultValue: "Nhân sự" }),
                icon: <FolderOpen size={20} />,
                subItems: [
                  {
                    label: t("sidebar.requests", { defaultValue: "Đơn từ" }),
                    shortName: t("sidebar.requestsShort", { defaultValue: "Duyệt đơn" }),
                    path: "/app/management/requests",
                    icon: <FileEdit size={16} />,
                    badge: "3 Mới",
                  },
                  {
                    label: t("sidebar.employees", { defaultValue: "Nhân viên" }),
                    shortName: t("sidebar.employeesShort", { defaultValue: "NV" }),
                    path: "/app/management/employees",
                    icon: <Users size={16} />,
                  },
                  {
                    label: t("sidebar.employeeCodes", { defaultValue: "Mã nhân viên" }),
                    shortName: t("sidebar.employeeCodesShort", { defaultValue: "Mã NV" }),
                    path: "/app/management/employee-codes",
                    icon: <FileText size={16} />,
                  },
                  {
                    label: t("sidebar.departments", { defaultValue: "Phòng ban" }),
                    shortName: t("sidebar.departmentsShort", { defaultValue: "Phòng ban" }),
                    path: "/app/management/departments",
                    icon: <Building2 size={16} />,
                  },
                  {
                    label: t("sidebar.positions", { defaultValue: "Vị trí" }),
                    shortName: t("sidebar.positionsShort", { defaultValue: "Vị trí" }),
                    path: "/app/management/positions",
                    icon: <Briefcase size={16} />,
                  },
                  {
                    label: t("sidebar.roles", { defaultValue: "Chức vụ" }),
                    shortName: t("sidebar.rolesShort", { defaultValue: "Chức vụ" }),
                    path: "/app/management/roles",
                    icon: <Layers size={16} />,
                  },
                ],
              },
              {
                id: "systemManagement",
                label: t("sidebar.systemManagement", { defaultValue: "Quản lý Hệ Thống" }),
                shortName: t("sidebar.systemManagementShort", { defaultValue: "Hệ thống" }),
                icon: <Settings size={20} />,
                subItems: [
                  {
                    label: t("sidebar.groups", { defaultValue: "Nhóm quyền / Mã quyền" }),
                    shortName: t("sidebar.groupsShort", { defaultValue: "Phân quyền" }),
                    path: "/app/management/groups",
                    icon: <CheckSquare size={16} />,
                  },
                  {
                    label: t("sidebar.timeSettings", { defaultValue: "Giờ giấc" }),
                    shortName: t("sidebar.timeSettingsShort", { defaultValue: "Giờ giấc" }),
                    path: "/app/management/time-settings",
                    icon: <Clock size={16} />,
                  },
                  {
                    label: t("sidebar.attendanceHistory", { defaultValue: "Lịch sử Chấm công" }),
                    shortName: t("sidebar.attendanceHistoryShort", { defaultValue: "Lịch sử CC" }),
                    path: "/app/management/attendance",
                    icon: <Calendar size={16} />,
                  },
                ],
              },
            ]
          : []),
      ],
    },
  ];

  return { sidebarData };
};
