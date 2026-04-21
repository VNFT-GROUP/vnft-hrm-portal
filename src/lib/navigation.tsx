import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/useAuthStore";
import { useLayoutStore } from "@/store/useLayoutStore";
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
  const sidebarMode = useLayoutStore((state) => state.sidebarMode);
  const { t } = useTranslation();

  const perms = session?.groupPermissions?.map(p => p.code) || [];
  const isAdmin = session?.groupName === "ADMIN";

  const hasManagementAccess = perms.some(p => [
    "USER_MANAGE", 
    "MASTER_DATA_MANAGE", 
    "REQUEST_FORM_APPROVE_ALL", 
    "REQUEST_FORM_APPROVE_DEPARTMENT",
    "PERFORMANCE_REVIEW_ALL", 
    "PERFORMANCE_REVIEW_DEPARTMENT", 
    "ATTENDANCE_MANAGE", 
    "SETTINGS_MANAGE"
  ].includes(p)) || isAdmin;

  const managementSubItems = [];
  if (isAdmin || perms.includes("REQUEST_FORM_APPROVE_ALL") || perms.includes("REQUEST_FORM_APPROVE_DEPARTMENT")) {
    managementSubItems.push({
      label: t("sidebar.requests", { defaultValue: "Đơn từ" }),
      shortName: t("sidebar.requestsShort", { defaultValue: "Duyệt đơn" }),
      path: "/app/management/requests",
      icon: <FileEdit size={16} />,
    });
  }
  if (isAdmin || perms.includes("PERFORMANCE_REVIEW_ALL") || perms.includes("PERFORMANCE_REVIEW_DEPARTMENT")) {
    managementSubItems.push({
      label: t("sidebar.performance", { defaultValue: "Đánh giá hiệu suất" }),
      shortName: t("sidebar.performanceShort", { defaultValue: "Đánh giá" }),
      path: "/app/management/performance",
      icon: <CheckSquare size={16} />,
    });
  }
  if (isAdmin || perms.includes("USER_MANAGE")) {
    managementSubItems.push({
      label: t("sidebar.employees", { defaultValue: "Nhân viên" }),
      shortName: t("sidebar.employeesShort", { defaultValue: "NV" }),
      path: "/app/management/employees",
      icon: <Users size={16} />,
    });
  }
  if (isAdmin || perms.includes("MASTER_DATA_MANAGE")) {
    managementSubItems.push(
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
        label: t("sidebar.jobTitles", { defaultValue: "Chức vụ" }),
        shortName: t("sidebar.rolesShort", { defaultValue: "Chức vụ" }),
        path: "/app/management/job-titles",
        icon: <Layers size={16} />,
      }
    );
  }

  const systemSubItems = [];
  if (isAdmin || perms.includes("SETTINGS_MANAGE")) {
    systemSubItems.push(
      {
        label: t("sidebar.groups", { defaultValue: "Nhóm quyền / Mã quyền" }),
        shortName: t("sidebar.groupsShort", { defaultValue: "Phân quyền" }),
        path: "/app/management/groups",
        icon: <CheckSquare size={16} />,
      },
      {
        label: t("sidebar.serverSettings", { defaultValue: "Cài đặt hệ thống" }),
        shortName: t("sidebar.serverSettingsShort", { defaultValue: "Cài đặt HT" }),
        path: "/app/management/server-settings",
        icon: <Settings size={16} />,
      }
    );
  }
  if (isAdmin || perms.includes("ATTENDANCE_MANAGE")) {
    systemSubItems.push({
      label: t("sidebar.attendanceHistory", { defaultValue: "Hikvision - Bản ghi" }),
      shortName: t("sidebar.attendanceHistoryShort", { defaultValue: "Hikvision Data" }),
      path: "/app/management/attendance",
      icon: <Calendar size={16} />,
    });
  }

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
        ...(hasManagementAccess && sidebarMode === "admin"
          ? [
              ...(managementSubItems.length > 0 ? [{
                id: "management",
                label: t("sidebar.management", { defaultValue: "Quản lý nhân sự" }),
                shortName: t("sidebar.managementShort", { defaultValue: "Nhân sự" }),
                icon: <FolderOpen size={20} />,
                subItems: managementSubItems,
              }] : []),
              ...(systemSubItems.length > 0 ? [{
                id: "systemManagement",
                label: t("sidebar.systemManagement", { defaultValue: "Quản lý Hệ Thống" }),
                shortName: t("sidebar.systemManagementShort", { defaultValue: "Hệ thống" }),
                icon: <Settings size={20} />,
                subItems: systemSubItems,
              }] : []),
            ]
          : []),
      ],
    },
  ];

  return { sidebarData, hasManagementAccess };
};
