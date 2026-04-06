import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./LoadingPage.css";

interface LoadingPageProps {
  /** Duration of loading in ms (default 3000) */
  duration?: number;
  /** Called when loading finishes */
  onComplete?: () => void;
  /** Loading message */
  message?: string;
}

/* ——— Static SVG sub-components (memoized, never re-render) ——— */

const AirplaneSvg = memo(function AirplaneSvg() {
  return (
    <div className="airplane">
      <svg width="64" height="32" viewBox="0 0 64 32" fill="none" className="airplane-svg">
        <ellipse cx="32" cy="16" rx="22" ry="5" fill="url(#plane-body)" />
        <path d="M54 16 L64 15 L54 14 Z" fill="#6b7280" />
        <path d="M10 16 L6 6 L16 14 Z" fill="url(#plane-tail)" />
        <path d="M10 16 L8 22 L16 18 Z" fill="#9ca3af" />
        <path d="M28 14 L22 2 L38 12 Z" fill="url(#plane-wing)" />
        <path d="M28 18 L22 30 L38 20 Z" fill="#94a3b8" />
        <circle cx="36" cy="15" r="1.2" fill="#bfdbfe" />
        <circle cx="40" cy="15" r="1.2" fill="#bfdbfe" />
        <circle cx="44" cy="15" r="1.2" fill="#bfdbfe" />
        <circle cx="48" cy="15.2" r="1.2" fill="#bfdbfe" />
        <path d="M52 14.5 Q56 14 56 16 Q56 18 52 17.5 Z" fill="#93c5fd" />
        <ellipse cx="30" cy="12" rx="3" ry="1.5" fill="#6b7280" />
        <defs>
          <linearGradient id="plane-body" x1="10" y1="11" x2="10" y2="21">
            <stop stopColor="#f1f5f9" />
            <stop offset="1" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="plane-wing" x1="22" y1="2" x2="38" y2="14">
            <stop stopColor="#2E3192" />
            <stop offset="1" stopColor="#1E2062" />
          </linearGradient>
          <linearGradient id="plane-tail" x1="6" y1="6" x2="16" y2="16">
            <stop stopColor="#2E3192" />
            <stop offset="1" stopColor="#1E2062" />
          </linearGradient>
        </defs>
      </svg>
      <div className="airplane-trail">
        <span className="trail-line trail-line--1" />
        <span className="trail-line trail-line--2" />
      </div>
    </div>
  );
});

const CloudsSvg = memo(function CloudsSvg() {
  return (
    <>
      <div className="cloud cloud--1">
        <svg width="60" height="28" viewBox="0 0 60 28" fill="none">
          <ellipse cx="30" cy="18" rx="25" ry="10" fill="#cbd5e1" fillOpacity="0.5" />
          <ellipse cx="20" cy="14" rx="14" ry="10" fill="#e2e8f0" fillOpacity="0.6" />
          <ellipse cx="40" cy="14" rx="14" ry="10" fill="#e2e8f0" fillOpacity="0.6" />
        </svg>
      </div>
      <div className="cloud cloud--2">
        <svg width="50" height="24" viewBox="0 0 50 24" fill="none">
          <ellipse cx="25" cy="16" rx="20" ry="8" fill="#cbd5e1" fillOpacity="0.4" />
          <ellipse cx="17" cy="12" rx="12" ry="8" fill="#e2e8f0" fillOpacity="0.5" />
          <ellipse cx="34" cy="12" rx="12" ry="8" fill="#e2e8f0" fillOpacity="0.5" />
        </svg>
      </div>
      <div className="cloud cloud--3">
        <svg width="45" height="22" viewBox="0 0 45 22" fill="none">
          <ellipse cx="22" cy="14" rx="18" ry="8" fill="#cbd5e1" fillOpacity="0.45" />
          <ellipse cx="14" cy="10" rx="10" ry="7" fill="#e2e8f0" fillOpacity="0.55" />
          <ellipse cx="32" cy="10" rx="10" ry="7" fill="#e2e8f0" fillOpacity="0.55" />
        </svg>
      </div>
    </>
  );
});

const TruckSvg = memo(function TruckSvg() {
  return (
    <svg width="80" height="48" viewBox="0 0 80 48" fill="none" className="truck-svg">
      <rect x="2" y="8" width="42" height="26" rx="3" fill="url(#cargo-grad)" stroke="#1E2062" strokeWidth="1.5" />
      <line x1="16" y1="8" x2="16" y2="34" stroke="#1E2062" strokeOpacity="0.4" strokeWidth="1" />
      <line x1="30" y1="8" x2="30" y2="34" stroke="#1E2062" strokeOpacity="0.4" strokeWidth="1" />
      <text x="22" y="24" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">VNFT</text>
      <rect x="44" y="14" width="22" height="20" rx="3" fill="url(#cabin-grad)" stroke="#1E2062" strokeWidth="1.5" />
      <rect x="48" y="17" width="14" height="8" rx="2" fill="#93a5f0" fillOpacity="0.5" stroke="#2E3192" strokeWidth="0.8" />
      <line x1="50" y1="17" x2="56" y2="25" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      <rect x="66" y="26" width="4" height="5" rx="1.5" fill="#F7941D" />
      <rect x="66" y="31" width="6" height="3" rx="1" fill="#6b7280" />
      <circle cx="14" cy="37" r="6" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
      <circle cx="14" cy="37" r="3" fill="#6b7280" />
      <circle cx="14" cy="37" r="1" fill="#9ca3af" />
      <circle cx="54" cy="37" r="6" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
      <circle cx="54" cy="37" r="3" fill="#6b7280" />
      <circle cx="54" cy="37" r="1" fill="#9ca3af" />
      <g className="wheel-spokes wheel-spokes--rear">
        <line x1="14" y1="34" x2="14" y2="40" stroke="#9ca3af" strokeWidth="0.5" />
        <line x1="11" y1="37" x2="17" y2="37" stroke="#9ca3af" strokeWidth="0.5" />
      </g>
      <g className="wheel-spokes wheel-spokes--front">
        <line x1="54" y1="34" x2="54" y2="40" stroke="#9ca3af" strokeWidth="0.5" />
        <line x1="51" y1="37" x2="57" y2="37" stroke="#9ca3af" strokeWidth="0.5" />
      </g>
      <rect x="6" y="33" width="58" height="2" rx="1" fill="#4b5563" />
      <defs>
        <linearGradient id="cargo-grad" x1="2" y1="8" x2="2" y2="34">
          <stop stopColor="#2E3192" />
          <stop offset="1" stopColor="#1E2062" />
        </linearGradient>
        <linearGradient id="cabin-grad" x1="44" y1="14" x2="44" y2="34">
          <stop stopColor="#4A4FC7" />
          <stop offset="1" stopColor="#2E3192" />
        </linearGradient>
      </defs>
    </svg>
  );
});

const ShipSvg = memo(function ShipSvg() {
  return (
    <svg width="72" height="36" viewBox="0 0 72 36" fill="none" className="ship-svg">
      <path d="M4 22 L8 32 L64 32 L68 22 Z" fill="url(#hull-grad)" stroke="#1E2062" strokeWidth="1" />
      <rect x="8" y="18" width="56" height="5" rx="1" fill="#d1d5db" stroke="#9ca3af" strokeWidth="0.5" />
      <rect x="12" y="10" width="10" height="8" rx="1" fill="#2E3192" stroke="#1E2062" strokeWidth="0.8" />
      <rect x="23" y="10" width="10" height="8" rx="1" fill="#F7941D" stroke="#D4780F" strokeWidth="0.8" />
      <rect x="34" y="10" width="10" height="8" rx="1" fill="#2E3192" stroke="#1E2062" strokeWidth="0.8" />
      <rect x="45" y="10" width="10" height="8" rx="1" fill="#F7941D" stroke="#D4780F" strokeWidth="0.8" />
      <rect x="16" y="3" width="10" height="7" rx="1" fill="#1E2062" stroke="#0F1040" strokeWidth="0.7" />
      <rect x="27" y="3" width="10" height="7" rx="1" fill="#D4780F" stroke="#b45309" strokeWidth="0.7" />
      <rect x="38" y="3" width="10" height="7" rx="1" fill="#1E2062" stroke="#0F1040" strokeWidth="0.7" />
      <rect x="56" y="8" width="8" height="10" rx="1" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
      <rect x="57" y="9" width="6" height="4" rx="0.5" fill="#bfdbfe" />
      <rect x="58" y="3" width="4" height="5" rx="0.5" fill="#F7941D" />
      <rect x="58" y="3" width="4" height="2" rx="0.5" fill="#1f2937" />
      <circle className="ship-smoke ship-smoke--1" cx="60" cy="1" r="2" fill="#94a3b8" fillOpacity="0.4" />
      <circle className="ship-smoke ship-smoke--2" cx="58" cy="-1" r="1.5" fill="#94a3b8" fillOpacity="0.3" />
      <line x1="4" y1="28" x2="68" y2="28" stroke="white" strokeOpacity="0.3" strokeWidth="0.5" />
      <defs>
        <linearGradient id="hull-grad" x1="36" y1="22" x2="36" y2="32">
          <stop stopColor="#1f2937" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
      </defs>
    </svg>
  );
});

const WavesSvg = memo(function WavesSvg() {
  return (
    <svg width="100%" height="20" viewBox="0 0 520 20" preserveAspectRatio="none">
      <path className="wave wave--1" d="M0 10 Q13 5 26 10 T52 10 T78 10 T104 10 T130 10 T156 10 T182 10 T208 10 T234 10 T260 10 T286 10 T312 10 T338 10 T364 10 T390 10 T416 10 T442 10 T468 10 T494 10 T520 10 V20 H0 Z" fill="#93a5f0" fillOpacity="0.3" />
      <path className="wave wave--2" d="M0 12 Q13 8 26 12 T52 12 T78 12 T104 12 T130 12 T156 12 T182 12 T208 12 T234 12 T260 12 T286 12 T312 12 T338 12 T364 12 T390 12 T416 12 T442 12 T468 12 T494 12 T520 12 V20 H0 Z" fill="#6B6FD6" fillOpacity="0.2" />
    </svg>
  );
});

const RoadDashes = memo(function RoadDashes() {
  return (
    <div className="road-dashes">
      {Array.from({ length: 20 }).map((_, i) => (
        <span key={i} className="road-dash" />
      ))}
    </div>
  );
});

/* ——— Main component ——— */

export default function LoadingPage({
  duration = 3000,
  onComplete,
  message = "Đang tải hệ thống...",
}: LoadingPageProps) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const stableOnComplete = useCallback(() => {
    onCompleteRef.current?.();
  }, []);

  useEffect(() => {
    const interval = 50;
    const step = (100 / duration) * interval;
    let raf: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = now - lastTime;
      if (delta >= interval) {
        lastTime = now;
        setProgress((prev) => {
          const next = prev + step + Math.random() * 0.3;
          if (next >= 100) {
            stableOnComplete();
            return 100;
          }
          return next;
        });
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, stableOnComplete]);

  const clampedProgress = useMemo(() => Math.min(progress, 100), [progress]);
  const trackStyle = useMemo(() => ({ width: `${clampedProgress}%` }), [clampedProgress]);
  const truckStyle = useMemo(() => ({ left: `${clampedProgress}%` }), [clampedProgress]);
  const truckClass = clampedProgress > 0 ? "truck truck--moving" : "truck";

  // Airplane & ship: their track width = progress, CSS handles back-and-forth inside
  const vehicleTrackStyle = useMemo(() => ({ width: `${clampedProgress}%` }), [clampedProgress]);


  return (
    <div className="loading-page">
      {/* Background decorations */}
      <div className="loading-bg-orb loading-bg-orb--1" />
      <div className="loading-bg-orb loading-bg-orb--2" />
      <div className="loading-bg-orb loading-bg-orb--3" />

      <div className="loading-content">
        {/* Logo / Brand */}
        <div className="loading-brand">
          <div className="loading-logo">
            <img
              src="/logo/Logo-VNFT-1024x1024.webp"
              alt="VNFT Logo"
              width={56}
              height={56}
              className="loading-logo-img"
            />
          </div>
          <h1 className="loading-title">VNFT Group</h1>
          <p className="loading-subtitle">HRM Portal</p>
        </div>

        {/* Full logistics scene */}
        <div className="loading-scene">
          {/* SKY */}
          <div className="loading-sky">
            <div className="airplane-track" style={vehicleTrackStyle}>
              <div className="airplane-shuttle">
                <AirplaneSvg />
              </div>
            </div>
            <CloudsSvg />
          </div>

          {/* ROAD */}
          <div className="loading-road">
            <div className="road-surface">
              <RoadDashes />
            </div>
            <div className="loading-track">
              <div className="loading-track-fill" style={trackStyle} />
              <div className="truck-container" style={truckStyle}>
                <div className={truckClass}>
                  <div className="truck-smoke">
                    <span className="smoke-puff smoke-puff--1" />
                    <span className="smoke-puff smoke-puff--2" />
                    <span className="smoke-puff smoke-puff--3" />
                  </div>
                  <TruckSvg />
                </div>
              </div>
            </div>
          </div>

          {/* WATER */}
          <div className="loading-water">
            <div className="water-waves">
              <WavesSvg />
            </div>
            <div className="ship-track" style={vehicleTrackStyle}>
              <div className="ship-shuttle">
                <div className="cargo-ship">
                  <ShipSvg />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress info */}
        <div className="loading-info">
          <p className="loading-message">{message}</p>
        </div>

        {/* Loading dots */}
        <div className="loading-dots">
          <span className="dot dot--1" />
          <span className="dot dot--2" />
          <span className="dot dot--3" />
        </div>
      </div>
    </div>
  );
}
