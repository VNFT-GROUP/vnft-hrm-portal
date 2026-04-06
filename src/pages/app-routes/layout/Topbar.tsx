import "./Topbar.css";

export default function Topbar() {
  return (
    <header className="app-topbar">
      <div className="topbar-left"></div>
      <div className="topbar-right">
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
