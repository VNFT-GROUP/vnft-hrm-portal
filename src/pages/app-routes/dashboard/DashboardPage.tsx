import { Users, UserCheck, Building, ArrowUpRight, ArrowDownRight, PackageCheck } from "lucide-react";
import "./DashboardPage.css";

const MOCK_STATS = [
  { title: "Tổng nhân sự", value: "1,248", trend: "+12%", trendLabel: "so với tháng trước", icon: <Users size={24} /> },
  { title: "Nhân viên mới", value: "42", trend: "+5%", trendLabel: "so với tháng trước", icon: <UserCheck size={24} /> },
  { title: "Năng suất Logistics", value: "96.4%", trend: "-0.5%", trendLabel: "so với tuần trước", icon: <PackageCheck size={24} /> },
  { title: "Phòng ban", value: "16", trend: "0%", trendLabel: "không thay đổi", icon: <Building size={24} /> },
];

const MOCK_EMPLOYEES = [
  { id: "VN8829", name: "Trần Thị B", role: "Trưởng phòng IT", department: "Khối Công Nghệ", status: "Hoạt động" },
  { id: "VN8830", name: "Lê Văn C", role: "Chuyên viên Logistics", department: "Khối Vận Hành", status: "Hoạt động" },
  { id: "VN8831", name: "Phạm Dương D", role: "Tài xế xe tải", department: "Đội Xe Miền Nam", status: "Đang nghỉ phép" },
  { id: "VN8832", name: "Hoàng Thanh E", role: "Kế toán trưởng", department: "Phòng Tài Chính", status: "Hoạt động" },
  { id: "VN8833", name: "Nguyễn Văn F", role: "Nhân sự", department: "Phòng Hành Chính", status: "Thử việc" },
];

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Tổng quan hệ thống</h1>
          <p>Theo dõi các chỉ số nhân sự và điều phối của VNFT Logistics</p>
        </div>
        <div className="header-actions">
          <button className="primary-btn">Tải báo cáo tháng</button>
        </div>
      </div>

      <div className="stats-grid">
        {MOCK_STATS.map((stat) => {
          const isNegative = stat.trend.startsWith('-');
          const isNeutral = stat.trend === "0%";
          return (
            <div key={stat.title} className="stat-card">
              <div className="stat-header">
                <div className="stat-info">
                  <span className="stat-title">{stat.title}</span>
                  <span className="stat-value">{stat.value}</span>
                </div>
                <div className="stat-icon">{stat.icon}</div>
              </div>
              <div className="stat-footer">
                <div className={`stat-trend ${isNegative ? 'negative' : isNeutral ? 'neutral' : 'positive'}`}>
                  {isNeutral ? null : isNegative ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                  <span>{stat.trend}</span>
                </div>
                <span className="stat-trend-label">{stat.trendLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-content-grid">
        <div className="dashboard-card table-card">
          <div className="card-header">
            <h3>Danh sách nhân sự mới</h3>
            <button className="text-btn">Xem tất cả</button>
          </div>
          <div className="table-responsive">
            <table className="mock-table">
              <thead>
                <tr>
                  <th>Mã NV</th>
                  <th>Họ tên</th>
                  <th>Phòng ban / Vị trí</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_EMPLOYEES.map((emp) => (
                  <tr key={emp.id}>
                    <td><span className="emp-id">{emp.id}</span></td>
                    <td>
                      <div className="emp-name-cell">
                        <div className="emp-avatar">{emp.name.charAt(0)}</div>
                        <span className="emp-name">{emp.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="emp-role-cell">
                        <span className="emp-department">{emp.department}</span>
                        <span className="emp-role">{emp.role}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${
                        emp.status === "Hoạt động" ? "active" : 
                        emp.status === "Đang nghỉ phép" ? "on-leave" : "probation"
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
