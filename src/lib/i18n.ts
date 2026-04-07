import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  vi: {
    translation: {
      profile: {
        title: "Tài khoản",
        guide: "Hướng dẫn sử dụng",
        shortcuts: "Các phím tắt",
        language: "Ngôn ngữ",
        changePassword: "Đổi mật khẩu",
        logout: "Đăng xuất"
      },
      sidebar: {
        dashboard: "Dashboard",
        profile: "Hồ sơ cá nhân",
        calendar: "Lịch & Sự kiện",
        management: "Quản lý",
        employees: "Nhân viên",
        departments: "Phòng ban",
        roles: "Chức vụ",
        attendance: "Chấm công",
        evaluationCriteria: "Tiêu chí đánh giá",
        permissions: "Vai trò",
        contracts: "Hợp đồng",
        evaluation: "Đánh giá",
        voting: "Bình chọn",
        requests: "Đơn từ",
        finance: "Tài chính",
        financeReports: "Báo cáo tài chính",
        reports: "Báo cáo",
        settings: "Cài đặt",
        activityLogs: "Nhật ký hoạt động"
      },
      login: {
        tagline: "YÊU CẦU XÁC THỰC",
        emailLabel: "EMAIL NHÂN VIÊN",
        emailPlaceholder: "vd: employee@vnft.vn",
        passwordLabel: "MÃ BẢO MẬT",
        forgot: "QUÊN?",
        submit: "TRUY CẬP HỆ THỐNG",
        loadingAuth: "Hệ thống đang khởi tạo xác thực...",
        loadingSystem: "Đang tải hệ thống..."
      }
    }
  },
  en: {
    translation: {
      profile: {
        title: "Account",
        guide: "User Guide",
        shortcuts: "Shortcuts",
        language: "Language",
        changePassword: "Change Password",
        logout: "Log Out"
      },
      sidebar: {
        dashboard: "Dashboard",
        profile: "My Profile",
        calendar: "Calendar & Events",
        management: "Management",
        employees: "Employees",
        departments: "Departments",
        roles: "Job Roles",
        attendance: "Attendance",
        evaluationCriteria: "Evaluation Criteria",
        permissions: "Permissions",
        contracts: "Contracts",
        evaluation: "Evaluation",
        voting: "Voting",
        requests: "Requests",
        finance: "Finance",
        financeReports: "Financial Reports",
        reports: "Reports",
        settings: "Settings",
        activityLogs: "Activity Logs"
      },
      login: {
        tagline: "AUTHENTICATION REQUIRED",
        emailLabel: "EMPLOYEE EMAIL",
        emailPlaceholder: "e.g. employee@vnft.vn",
        passwordLabel: "SECURITY KEY",
        forgot: "FORGOT?",
        submit: "ACCESS PORTAL",
        loadingAuth: "Loading authentication system...",
        loadingSystem: "Loading system..."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

export default i18n;
