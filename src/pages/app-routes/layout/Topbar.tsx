import "./Topbar.css";

export default function Topbar() {
  return (
    <header className="app-topbar">
      {/* Animated Ambient Color Blobs */}
      <div className="topbar-ambient">
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>
      </div>

      {/* Animated Floating Geometric Particles */}
      <div className="topbar-flow">
        <svg viewBox="0 0 600 72" className="obj-abstract">
           <g className="floating-obj float-1">
             <rect x="30" y="20" width="16" height="16" rx="3" fill="none" stroke="rgba(46,49,146,0.3)" strokeWidth="1.5" />
             <rect x="35" y="25" width="6" height="6" rx="1" fill="rgba(247,148,29,0.7)" />
           </g>

           <g className="floating-obj float-2">
             <circle cx="120" cy="40" r="14" fill="none" stroke="rgba(247,148,29,0.3)" strokeWidth="1.5" />
             <circle cx="120" cy="40" r="4" fill="rgba(46,49,146,0.7)" />
           </g>

           <g className="floating-obj float-3">
             <polygon points="210,15 228,45 192,45" fill="none" stroke="rgba(46,49,146,0.3)" strokeWidth="1.5" strokeLinejoin="round" />
             <circle cx="210" cy="33" r="3" fill="rgba(247,148,29,0.7)" />
           </g>
           
           <g className="floating-obj float-4">
             <path d="M300,18 L322,40 L300,62 L278,40 Z" fill="none" stroke="rgba(247,148,29,0.3)" strokeWidth="1.5" strokeLinejoin="round" />
             <rect x="295" y="35" width="10" height="10" rx="2" fill="rgba(46,49,146,0.7)" />
           </g>
           
           <g className="floating-obj float-5">
             <circle cx="400" cy="25" r="10" fill="none" stroke="rgba(46,49,146,0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
             <polygon points="400,20 405,30 395,30" fill="rgba(247,148,29,0.7)" />
           </g>
        </svg>
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
