import { LayoutDashboard, Users, Clock, CreditCard, UserPlus, Settings, Package, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="app-sidebar">
      
      <nav className="sidebar-nav">
        <div className="nav-section">MENU CHÍNH</div>
        <ul>
          <li className="active">
            <LayoutDashboard size={20} />
            <span>Tổng quan</span>
          </li>
          <li>
            <Users size={20} />
            <span>Nhân sự</span>
          </li>
          <li>
            <Clock size={20} />
            <span>Chấm công</span>
          </li>
          <li>
            <CreditCard size={20} />
            <span>Lương & Thưởng</span>
          </li>
        </ul>

        <div className="nav-section">QUẢN TRỊ & MỞ RỘNG</div>
        <ul>
          <li>
            <UserPlus size={20} />
            <span>Tuyển dụng</span>
          </li>
          <li>
            <Package size={20} />
            <span>Đội xe & Kho</span>
          </li>
          <li>
            <Settings size={20} />
            <span>Cài đặt hệ thống</span>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={() => navigate("/login")}>
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
