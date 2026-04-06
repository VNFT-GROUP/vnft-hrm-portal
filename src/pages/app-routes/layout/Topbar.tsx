import { Bell, Search, MessageSquare } from "lucide-react";
import "./Topbar.css";

export default function Topbar() {
  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Tìm kiếm nhân viên, phòng ban..." />
        </div>
      </div>
      <div className="topbar-right">
        <button className="icon-btn notif-btn">
          <MessageSquare size={20} />
          <span className="notif-badge">2</span>
        </button>
        <button className="icon-btn notif-btn">
          <Bell size={20} />
          <span className="notif-badge">5</span>
        </button>
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">Quản trị viên</span>
            <span className="user-role">Super Admin</span>
          </div>
          <img src="https://i.pravatar.cc/150?img=11" alt="User" />
        </div>
      </div>
    </header>
  );
}
