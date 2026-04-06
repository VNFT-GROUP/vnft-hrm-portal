import { LayoutDashboard, Users, Clock, CreditCard, UserPlus, Settings, Package, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="app-sidebar">
      {/* Dynamic Background Objects */}
      <div className="sidebar-bg-objects">
        {/* Wireframe Cube */}
        <svg className="sb-obj obj-box" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>

        {/* Orbit Rings */}
        <svg className="sb-obj obj-ring" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>

        {/* Polygon */}
        <svg className="sb-obj obj-poly" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </div>

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
