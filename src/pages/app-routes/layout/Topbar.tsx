import "./Topbar.css";

export default function Topbar() {
  return (
    <header className="app-topbar">
      {/* Animated Ambient Color Blobs */}
      <div className="topbar-ambient">
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>
      </div>

      {/* Animated Flow SVGs */}
      <div className="topbar-flow">
        <svg viewBox="0 0 600 72" className="flow-lines">
          {/* Base lines */}
          <path d="M 0,36 C 150,36 200,15 300,36 S 450,57 600,36" fill="none" stroke="rgba(46, 49, 146, 0.08)" strokeWidth="1.5" />
          <path d="M 0,50 C 150,50 200,30 300,50 S 450,70 600,50" fill="none" stroke="rgba(247, 148, 29, 0.08)" strokeWidth="1" />
          
          {/* Animated packets */}
          <path d="M 0,36 C 150,36 200,15 300,36 S 450,57 600,36" fill="none" stroke="#2E3192" strokeWidth="2" className="packet-anim-1" />
          <path d="M 0,50 C 150,50 200,30 300,50 S 450,70 600,50" fill="none" stroke="#F7941D" strokeWidth="1.5" className="packet-anim-2" />
          
          {/* Node points */}
          <circle cx="300" cy="36" r="3" className="pulse-node node-blue" />
          <circle cx="450" cy="57" r="2.5" className="pulse-node node-orange" />
          <circle cx="150" cy="36" r="2" className="pulse-node node-blue" />
        </svg>
      </div>

      <div className="topbar-left">
        <h2 className="topbar-title">Hệ thống Quản trị Nhân sự</h2>
      </div>
      <div className="topbar-right relative z-10">
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
