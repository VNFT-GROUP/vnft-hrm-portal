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
  BarChart3,
  Link2,
  Calculator,
} from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";

export const useNavigationData = () => {
  const { session } = useAuthStore();

  const { t } = useTranslation();

  const perms = session?.groupPermissions?.map(p => p.code) || [];
  const isAdmin = session?.groupName === "ADMIN";

  const hasManagementAccess = session?.isManager === true || perms.some(p => ([
    PERMISSIONS.USER_MANAGE, 
    PERMISSIONS.MASTER_DATA_MANAGE, 
    PERMISSIONS.REQUEST_FORM_APPROVE_ALL, 
    PERMISSIONS.REQUEST_FORM_APPROVE_DEPARTMENT,
    PERMISSIONS.PERFORMANCE_REVIEW_ALL, 
    PERMISSIONS.PERFORMANCE_REVIEW_DEPARTMENT, 
    PERMISSIONS.ATTENDANCE_MANAGE, 
    PERMISSIONS.PAYROLL_MANAGE,
    PERMISSIONS.PROFIT_REPORT_MANAGE,
    PERMISSIONS.SETTINGS_MANAGE,
    PERMISSIONS.ALLOWANCE_REPORT_VIEW
  ] as string[]).includes(p)) || isAdmin;

  const opsSubItems = [];
  if (isAdmin || perms.includes(PERMISSIONS.REQUEST_FORM_APPROVE_ALL) || (session?.isManager && perms.includes(PERMISSIONS.REQUEST_FORM_APPROVE_DEPARTMENT))) {
    opsSubItems.push({
      label: t("sidebar.requests", { defaultValue: "Duyệt Đơn từ" }),
      shortName: t("sidebar.requestsShort", { defaultValue: "Duyệt đơn" }),
      path: "/app/management/requests",
      icon: <FileEdit size={16} />,
    });
  }
  if (isAdmin || perms.includes(PERMISSIONS.PERFORMANCE_REVIEW_ALL) || (session?.isManager && perms.includes(PERMISSIONS.PERFORMANCE_REVIEW_DEPARTMENT))) {
    opsSubItems.push({
      label: t("sidebar.performance", { defaultValue: "Performance & KPI" }),
      shortName: t("sidebar.performanceShort", { defaultValue: "Perf&KPI" }),
      path: "/app/management/evaluation",
      icon: <CheckSquare size={16} />,
    });
  }
  if (isAdmin || perms.includes(PERMISSIONS.ALLOWANCE_REPORT_VIEW)) {
    opsSubItems.push({
      label: t("sidebar.reports", { defaultValue: "Báo cáo nội bộ" }),
      shortName: t("sidebar.reportsShort", { defaultValue: "Báo cáo" }),
      path: "/app/reports",
      icon: <BarChart3 size={16} />,
    });
  }
  if (isAdmin || perms.includes(PERMISSIONS.PAYROLL_MANAGE)) {
    opsSubItems.push({
      label: t("sidebar.payroll", { defaultValue: "Bảng lương" }),
      shortName: t("sidebar.payrollShort", { defaultValue: "Lương" }),
      path: "/app/management/payroll",
      icon: <FileText size={16} />,
    });
  }
  const accSubItems = [];
  if (isAdmin || perms.includes(PERMISSIONS.PROFIT_REPORT_MANAGE)) {
    accSubItems.push({
      label: t("sidebar.profitReport", { defaultValue: "Báo cáo Lợi nhuận" }),
      shortName: t("sidebar.profitReportShort", { defaultValue: "Lợi nhuận" }),
      path: "/app/acc/profit-report",
      icon: <BarChart3 size={16} />,
    });
    accSubItems.push({
      label: t("sidebar.salesmanMapping", { defaultValue: "Đối chiếu Nhân viên" }),
      shortName: t("sidebar.salesmanMappingShort", { defaultValue: "Đối chiếu" }),
      path: "/app/acc/profit-report/salesman-mappings",
      icon: <Link2 size={16} />,
    });
  }

  const masterDataSubItems = [];
  if (isAdmin || perms.includes(PERMISSIONS.USER_MANAGE)) {
    masterDataSubItems.push({
      label: t("sidebar.employees", { defaultValue: "Hồ sơ nhân sự" }),
      shortName: t("sidebar.employeesShort", { defaultValue: "Nhân sự" }),
      path: "/app/management/employees",
      icon: <Users size={16} />,
    });
  }
  if (isAdmin || perms.includes(PERMISSIONS.MASTER_DATA_MANAGE)) {
    masterDataSubItems.push(
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

  const adminSubItems = [];
  if (isAdmin || perms.includes(PERMISSIONS.SETTINGS_MANAGE)) {
    adminSubItems.push(
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
  if (isAdmin || perms.includes(PERMISSIONS.ATTENDANCE_MANAGE)) {
    adminSubItems.push({
      label: t("sidebar.attendanceHistory", { defaultValue: "Hikvision - Bản ghi" }),
      shortName: t("sidebar.attendanceHistoryShort", { defaultValue: "Hikvision" }),
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
        ...(hasManagementAccess
          ? [
              ...(opsSubItems.length > 0 ? [{
                id: "operations",
                label: t("sidebar.operations", { defaultValue: "Nghiệp vụ" }),
                shortName: t("sidebar.opsShort", { defaultValue: "Nghiệp vụ" }),
                icon: <FolderOpen size={20} />,
                subItems: opsSubItems,
              }] : []),
              ...(accSubItems.length > 0 ? [{
                id: "accounting",
                label: t("sidebar.accounting", { defaultValue: "Kế toán" }),
                shortName: t("sidebar.accountingShort", { defaultValue: "Kế toán" }),
                icon: <Calculator size={20} />,
                subItems: accSubItems,
              }] : []),
              ...(masterDataSubItems.length > 0 ? [{
                id: "organization",
                label: t("sidebar.organization", { defaultValue: "Tổ chức & Nhân sự" }),
                shortName: t("sidebar.orgShort", { defaultValue: "Tổ chức" }),
                icon: <Users size={20} />,
                subItems: masterDataSubItems,
              }] : []),
              ...(adminSubItems.length > 0 ? [{
                id: "systemManagement",
                label: t("sidebar.systemManagement", { defaultValue: "Quản trị Hệ thống" }),
                shortName: t("sidebar.systemShort", { defaultValue: "Quản trị" }),
                icon: <Settings size={20} />,
                subItems: adminSubItems,
              }] : []),
            ]
          : []),
      ],
    },
  ];

  return { sidebarData, hasManagementAccess };
};
