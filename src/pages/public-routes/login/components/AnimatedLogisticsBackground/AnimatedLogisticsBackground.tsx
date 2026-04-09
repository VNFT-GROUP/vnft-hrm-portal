
import "./AnimatedLogisticsBackground.css";

const ContainerTruck = ({ containerColor, cabColor, opacity = 1, flipped = false }: { containerColor: string; cabColor: string; opacity?: number; flipped?: boolean; }) => (
  <svg width="48" height="24" viewBox="0 0 64 32" opacity={opacity} style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    <path d="M52 16 L54 20 V26 H46 V16 H52 Z" fill={cabColor} />
    <rect x="48" y="18" width="3" height="3" fill="#ffffff" opacity="0.8"/>
    <rect x="2" y="26" width="44" height="2" fill="#1e293b" />
    <rect x="4" y="6" width="40" height="20" rx="1" fill={containerColor} />
    <rect x="10" y="6" width="1.5" height="20" fill="#ffffff" opacity="0.15" />
    <rect x="16" y="6" width="1.5" height="20" fill="#ffffff" opacity="0.15" />
    <rect x="22" y="6" width="1.5" height="20" fill="#ffffff" opacity="0.15" />
    <rect x="28" y="6" width="1.5" height="20" fill="#ffffff" opacity="0.15" />
    <rect x="34" y="6" width="1.5" height="20" fill="#ffffff" opacity="0.15" />
    <rect x="40" y="6" width="1.5" height="20" fill="#ffffff" opacity="0.15" />
    <circle cx="50" cy="28" r="4" fill="#0f172a" />
    <circle cx="50" cy="28" r="1.5" fill="#94a3b8" />
    <circle cx="42" cy="28" r="4" fill="#0f172a" />
    <circle cx="42" cy="28" r="1.5" fill="#94a3b8" />
    <circle cx="10" cy="28" r="4" fill="#0f172a" />
    <circle cx="10" cy="28" r="1.5" fill="#94a3b8" />
    <circle cx="18" cy="28" r="4" fill="#0f172a" />
    <circle cx="18" cy="28" r="1.5" fill="#94a3b8" />
  </svg>
);

const ContainerShip = ({ mainColor, accentColor, opacity = 1 }: { mainColor: string; accentColor: string; opacity?: number; }) => (
  <svg width="60" height="30" viewBox="0 0 80 40" opacity={opacity}>
    <path d="M4 28 L10 36 H64 L76 28 Z" fill="#334155" />
    <path d="M7 32 H67 L64 36 H10 Z" fill="#94a3b8" opacity="0.3" />
    <rect x="12" y="14" width="10" height="14" fill="#E2E8F0" />
    <rect x="14" y="10" width="6" height="4" fill="#cbd5e1" />
    <rect x="14" y="16" width="6" height="3" fill="#64748b" />
    <rect x="14" y="21" width="6" height="3" fill="#64748b" />
    <rect x="25" y="20" width="8" height="8" rx="0.5" fill={mainColor} />
    <rect x="25" y="12" width="8" height="8" rx="0.5" fill={accentColor} />
    <rect x="34" y="20" width="8" height="8" rx="0.5" fill={accentColor} />
    <rect x="34" y="12" width="8" height="8" rx="0.5" fill="#eab308" />
    <rect x="43" y="12" width="8" height="16" rx="0.5" fill={mainColor} />
    <rect x="52" y="20" width="8" height="8" rx="0.5" fill={accentColor} />
    <rect x="52" y="12" width="8" height="8" rx="0.5" fill="#ef4444" />
    <g fill="#ffffff" opacity="0.25">
      <rect x="27" y="13" width="1" height="14" />
      <rect x="29" y="13" width="1" height="14" />
      <rect x="31" y="13" width="1" height="14" />
      <rect x="36" y="13" width="1" height="14" />
      <rect x="38" y="13" width="1" height="14" />
      <rect x="40" y="13" width="1" height="14" />
      <rect x="45" y="13" width="1" height="14" />
      <rect x="47" y="13" width="1" height="14" />
      <rect x="49" y="13" width="1" height="14" />
      <rect x="54" y="13" width="1" height="14" />
      <rect x="56" y="13" width="1" height="14" />
      <rect x="58" y="13" width="1" height="14" />
    </g>
  </svg>
);

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
          <svg width="220" height="60" viewBox="0 0 24 24" preserveAspectRatio="none" fill="#ffffff" opacity="0.8">
             <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.2217 20.3094 10.3392 18.1219 10.0401C17.6534 6.64016 14.7431 4 11.5 4C8.58334 4 6.09637 5.92218 5.30907 8.52044C2.86877 8.78441 1 10.8407 1 13.5C1 16.5376 3.46243 19 6.5 19H17.5Z"/>
          </svg>
        </div>
        <div className="bg-cloud cloud-medium">
          <svg width="160" height="40" viewBox="0 0 24 24" preserveAspectRatio="none" fill="#ffffff" opacity="0.6">
             <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.2217 20.3094 10.3392 18.1219 10.0401C17.6534 6.64016 14.7431 4 11.5 4C8.58334 4 6.09637 5.92218 5.30907 8.52044C2.86877 8.78441 1 10.8407 1 13.5C1 16.5376 3.46243 19 6.5 19H17.5Z"/>
          </svg>
        </div>
        <div className="bg-cloud cloud-small">
          <svg width="110" height="28" viewBox="0 0 24 24" preserveAspectRatio="none" fill="#ffffff" opacity="0.7">
             <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.2217 20.3094 10.3392 18.1219 10.0401C17.6534 6.64016 14.7431 4 11.5 4C8.58334 4 6.09637 5.92218 5.30907 8.52044C2.86877 8.78441 1 10.8407 1 13.5C1 16.5376 3.46243 19 6.5 19H17.5Z"/>
          </svg>
        </div>
      </div>

      {/* Airplanes */}
      <div className="bg-airplane track-1">
        <svg fill="#2E3192" width="36" height="36" viewBox="0 0 24 24" style={{ transform: 'rotate(90deg)' }} opacity="0.6">
          <path d="M21 16v-2l-8-5V3.5c0-.82-.67-1.5-1.5-1.5S10 2.68 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
      <div className="bg-airplane track-2">
        <svg fill="#F7941D" width="28" height="28" viewBox="0 0 24 24" style={{ transform: 'rotate(90deg)' }} opacity="0.45">
          <path d="M21 16v-2l-8-5V3.5c0-.82-.67-1.5-1.5-1.5S10 2.68 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
      <div className="bg-airplane track-1" style={{ top: '8%', animationDelay: '-12s', animationDuration: '35s' }}>
        <svg fill="#64748b" width="30" height="30" viewBox="0 0 24 24" style={{ transform: 'rotate(90deg)' }} opacity="0.5">
          <path d="M21 16v-2l-8-5V3.5c0-.82-.67-1.5-1.5-1.5S10 2.68 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
      <div className="bg-airplane track-2" style={{ top: '28%', animationDelay: '-2s', animationDuration: '40s' }}>
        <svg fill="#94a3b8" width="22" height="22" viewBox="0 0 24 24" style={{ transform: 'rotate(90deg)' }} opacity="0.3">
          <path d="M21 16v-2l-8-5V3.5c0-.82-.67-1.5-1.5-1.5S10 2.68 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
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
        {/* Fast lane trucks (moving right) */}
        <div className="bg-truck track-right">
          <ContainerTruck containerColor="#2E3192" cabColor="#475569" opacity={0.75} />
        </div>
        <div className="bg-truck track-right" style={{ animationDelay: '-11s', animationDuration: '26s' }}>
          <ContainerTruck containerColor="#F7941D" cabColor="#64748b" opacity={0.7} />
        </div>
        
        {/* Slow lane trucks (moving right) */}
        <div className="bg-truck track-right" style={{ animationDelay: '-4s', animationDuration: '30s', bottom: '-1px' }}>
          <ContainerTruck containerColor="#94a3b8" cabColor="#475569" opacity={0.6} />
        </div>

        {/* Opposite lane trucks (moving left) */}
        <div className="bg-truck track-left">
          <ContainerTruck containerColor="#4A4FC7" cabColor="#64748b" opacity={0.55} flipped={true} />
        </div>
        <div className="bg-truck track-left" style={{ animationDelay: '-14s', animationDuration: '24s', bottom: '1px' }}>
          <ContainerTruck containerColor="#475569" cabColor="#94a3b8" opacity={0.5} flipped={true} />
        </div>
        <div className="bg-truck track-left" style={{ animationDelay: '-5s', animationDuration: '19s', bottom: '4px' }}>
          <ContainerTruck containerColor="#f59e0b" cabColor="#cbd5e1" opacity={0.45} flipped={true} />
        </div>
      </div>

      {/* Ocean & Ship */}
      <div className="bg-ocean-container">
        <svg className="ocean-waves" viewBox="0 0 520 40" preserveAspectRatio="none">
          <path className="wave wave-1" d="M0 20 Q13 14 26 20 T52 20 T78 20 T104 20 T130 20 T156 20 T182 20 T208 20 T234 20 T260 20 T286 20 T312 20 T338 20 T364 20 T390 20 T416 20 T442 20 T468 20 T494 20 T520 20 V40 H0 Z" fill="#93a5f0" opacity="0.15" />
          <path className="wave wave-2" d="M0 24 Q13 18 26 24 T52 24 T78 24 T104 24 T130 24 T156 24 T182 24 T208 24 T234 24 T260 24 T286 24 T312 24 T338 24 T364 24 T390 24 T416 24 T442 24 T468 24 T494 24 T520 24 V40 H0 Z" fill="#6B6FD6" opacity="0.1" />
        </svg>
        <div className="bg-ship cargo-ship" style={{ animationDelay: '-25s', animationDuration: '60s' }}>
          <ContainerShip mainColor="#F7941D" accentColor="#475569" opacity={0.65} />
        </div>
        <div className="bg-ship cargo-ship">
          <ContainerShip mainColor="#2E3192" accentColor="#F7941D" opacity={0.85} />
        </div>
      </div>
    </div>
  );
}
