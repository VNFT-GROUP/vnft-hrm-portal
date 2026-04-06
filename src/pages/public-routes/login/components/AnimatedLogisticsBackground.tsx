
import "./AnimatedLogisticsBackground.css";

export default function AnimatedLogisticsBackground() {
  return (
    <div className="login-animated-bg">
      {/* Soft Sky Gradient */}
      <div className="bg-gradient-overlay" />
      
      {/* Sun/Glow */}
      <div className="bg-sun-glow" />

      {/* Flock of Birds */}
      <div className="bg-flock-container">
        <svg className="bg-flock" width="100" height="40" viewBox="0 0 100 40" fill="none" stroke="#64748b" strokeWidth="1.2">
          <path d="M10 20 Q15 12 20 20 Q25 12 30 20" className="bird bird-flap" />
          <path d="M25 32 Q30 24 35 32 Q40 24 45 32" className="bird bird-flap delay-1" />
          <path d="M40 10 Q45 2 50 10 Q55 2 60 10" className="bird bird-flap delay-2" />
          <path d="M55 26 Q60 18 65 26 Q70 18 75 26" className="bird bird-flap delay-3" />
        </svg>
      </div>

      {/* Floating Hot Air Balloon */}
      <div className="bg-balloon-container">
        <svg className="bg-balloon" width="40" height="50" viewBox="0 0 40 50">
          <path d="M20 2 C9 2 2 9 2 20 C2 30 14 38 16 42 L24 42 C26 38 38 30 38 20 C38 9 31 2 20 2 Z" fill="url(#balloon-stripes)" opacity="0.6" />
          <path d="M17 44 L23 44 L22 48 L18 48 Z" fill="#9ca3af" />
          <defs>
            <linearGradient id="balloon-stripes" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F7941D" />
              <stop offset="50%" stopColor="#fca5a5" />
              <stop offset="100%" stopColor="#2E3192" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Clouds Layer */}
      <div className="bg-clouds-wrapper">
        <div className="bg-cloud cloud-big">
          <svg width="180" height="60" viewBox="0 0 120 40" fill="#ffffff" opacity="0.65">
            <ellipse cx="60" cy="20" rx="40" ry="15" />
            <ellipse cx="40" cy="24" rx="25" ry="12" />
            <ellipse cx="80" cy="22" rx="25" ry="12" />
          </svg>
        </div>
        <div className="bg-cloud cloud-medium">
          <svg width="120" height="40" viewBox="0 0 90 30" fill="#ffffff" opacity="0.5">
            <ellipse cx="45" cy="15" rx="30" ry="12" />
            <ellipse cx="25" cy="18" rx="20" ry="10" />
            <ellipse cx="65" cy="18" rx="20" ry="10" />
          </svg>
        </div>
        <div className="bg-cloud cloud-small">
          <svg width="100" height="35" viewBox="0 0 90 30" fill="#ffffff" opacity="0.55">
            <ellipse cx="45" cy="15" rx="25" ry="10" />
            <ellipse cx="25" cy="18" rx="15" ry="8" />
            <ellipse cx="60" cy="16" rx="18" ry="9" />
          </svg>
        </div>
      </div>

      {/* Airplanes */}
      <div className="bg-airplane track-1">
        <svg width="64" height="32" viewBox="0 0 64 32" fill="none" opacity="0.5">
          <ellipse cx="32" cy="16" rx="22" ry="5" fill="#94a3b8" />
          <path d="M54 16 L64 15 L54 14 Z" fill="#64748b" />
          <path d="M10 16 L6 6 L16 14 Z" fill="#2E3192" />
          <path d="M28 14 L22 2 L38 12 Z" fill="#2E3192" />
          <ellipse cx="30" cy="12" rx="3" ry="1.5" fill="#f1f5f9" />
        </svg>
      </div>
      <div className="bg-airplane track-2">
        <svg width="48" height="24" viewBox="0 0 64 32" fill="none" opacity="0.3">
          <ellipse cx="32" cy="16" rx="22" ry="5" fill="#94a3b8" />
          <path d="M54 16 L64 15 L54 14 Z" fill="#64748b" />
          <path d="M10 16 L6 6 L16 14 Z" fill="#F7941D" />
          <path d="M28 14 L22 2 L38 12 Z" fill="#F7941D" />
        </svg>
      </div>

      {/* Distant Hills & Wind Turbines */}
      <div className="bg-hills-layer">
        <svg className="bg-hills-svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path d="M0,100 L0,50 Q150,20 300,50 T600,40 T900,60 L1000,45 L1000,100 Z" fill="#d1d5db" opacity="0.25" />
          <path d="M0,100 L0,60 Q200,40 400,70 T800,50 L1000,65 L1000,100 Z" fill="#e2e8f0" opacity="0.3" />
        </svg>
        <div className="turbine" style={{ left: "15%", top: "35%", transform: "scale(0.6)" }}>
          <div className="turbine-pole" />
          <div className="turbine-blades"><div className="blade b1"/><div className="blade b2"/><div className="blade b3"/></div>
        </div>
        <div className="turbine" style={{ left: "28%", top: "45%", transform: "scale(0.8)" }}>
          <div className="turbine-pole" />
          <div className="turbine-blades"><div className="blade b1"/><div className="blade b2"/><div className="blade b3"/></div>
        </div>
        <div className="turbine" style={{ right: "20%", top: "40%", transform: "scale(0.7)" }}>
          <div className="turbine-pole" />
          <div className="turbine-blades"><div className="blade b1"/><div className="blade b2"/><div className="blade b3"/></div>
        </div>
      </div>

      {/* Cargo Highway & Trucks */}
      <div className="bg-highway">
        <div className="highway-line" />
        <div className="bg-truck track-right">
          <svg width="40" height="24" viewBox="0 0 80 48" fill="none" opacity="0.5">
            <rect x="2" y="8" width="42" height="26" rx="3" fill="#2E3192" />
            <rect x="44" y="14" width="22" height="20" rx="3" fill="#4A4FC7" />
            <rect x="48" y="17" width="14" height="8" rx="2" fill="#93a5f0" opacity="0.8" />
            <rect x="66" y="26" width="4" height="5" rx="1.5" fill="#F7941D" />
            <circle cx="14" cy="37" r="6" fill="#374151" />
            <circle cx="54" cy="37" r="6" fill="#374151" />
          </svg>
        </div>
        <div className="bg-truck track-left">
          <svg width="32" height="20" viewBox="0 0 80 48" fill="none" opacity="0.4" style={{ transform: "scaleX(-1)" }}>
            <rect x="2" y="8" width="42" height="26" rx="3" fill="#64748b" />
            <rect x="44" y="14" width="22" height="20" rx="3" fill="#94a3b8" />
            <circle cx="14" cy="37" r="6" fill="#475569" />
            <circle cx="54" cy="37" r="6" fill="#475569" />
          </svg>
        </div>
      </div>

      {/* Ocean & Ship */}
      <div className="bg-ocean-container">
        <svg className="ocean-waves" viewBox="0 0 520 40" preserveAspectRatio="none">
          <path className="wave wave-1" d="M0 20 Q13 14 26 20 T52 20 T78 20 T104 20 T130 20 T156 20 T182 20 T208 20 T234 20 T260 20 T286 20 T312 20 T338 20 T364 20 T390 20 T416 20 T442 20 T468 20 T494 20 T520 20 V40 H0 Z" fill="#93a5f0" opacity="0.15" />
          <path className="wave wave-2" d="M0 24 Q13 18 26 24 T52 24 T78 24 T104 24 T130 24 T156 24 T182 24 T208 24 T234 24 T260 24 T286 24 T312 24 T338 24 T364 24 T390 24 T416 24 T442 24 T468 24 T494 24 T520 24 V40 H0 Z" fill="#6B6FD6" opacity="0.1" />
        </svg>
        <div className="bg-ship cargo-ship">
          <svg width="56" height="28" viewBox="0 0 72 36" fill="none" opacity="0.45">
            <path d="M4 22 L8 32 L64 32 L68 22 Z" fill="#374151" />
            <rect x="8" y="18" width="56" height="5" rx="1" fill="#d1d5db" />
            <rect x="12" y="10" width="10" height="8" rx="1" fill="#2E3192" />
            <rect x="23" y="10" width="10" height="8" rx="1" fill="#F7941D" />
            <rect x="34" y="10" width="10" height="8" rx="1" fill="#2E3192" />
            <rect x="45" y="10" width="10" height="8" rx="1" fill="#F7941D" />
            <rect x="56" y="8" width="8" height="10" rx="1" fill="#f8fafc" />
          </svg>
        </div>
      </div>
    </div>
  );
}
