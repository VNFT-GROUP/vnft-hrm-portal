import { useEffect, useState } from "react";
import "./LoadingPage.css";

interface LoadingPageProps {
  /** Duration of loading in ms (default 3000) */
  duration?: number;
  /** Called when loading finishes */
  onComplete?: () => void;
  /** Loading message */
  message?: string;
}

export default function LoadingPage({
  duration = 3000,
  onComplete,
  message = "Đang tải hệ thống...",
}: LoadingPageProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 30;
    const step = (100 / duration) * interval;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step + Math.random() * 0.5;
        if (next >= 100) {
          clearInterval(timer);
          onComplete?.();
          return 100;
        }
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [duration, onComplete]);

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
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect
                x="4"
                y="4"
                width="40"
                height="40"
                rx="12"
                fill="url(#logo-grad)"
              />
              <path
                d="M16 32V20l8-6 8 6v12H26v-6h-4v6H16z"
                fill="white"
                fillOpacity="0.95"
              />
              <defs>
                <linearGradient
                  id="logo-grad"
                  x1="4"
                  y1="4"
                  x2="44"
                  y2="44"
                >
                  <stop stopColor="#10b981" />
                  <stop offset="1" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="loading-title">VNFT Group</h1>
          <p className="loading-subtitle">HRM Portal</p>
        </div>

        {/* Road scene */}
        <div className="loading-scene">
          {/* Sky elements */}
          <div className="loading-clouds">
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
          </div>

          {/* Road / Track */}
          <div className="loading-road">
            <div className="road-surface">
              {/* Road dashes */}
              <div className="road-dashes">
                {Array.from({ length: 20 }).map((_, i) => (
                  <span key={i} className="road-dash" />
                ))}
              </div>
            </div>

            {/* Progress track */}
            <div className="loading-track">
              <div
                className="loading-track-fill"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />

              {/* Truck on the progress bar */}
              <div
                className="truck-container"
                style={{ left: `${Math.min(progress, 100)}%` }}
              >
                <div className={`truck ${progress > 0 ? "truck--moving" : ""}`}>
                  {/* Exhaust smoke */}
                  <div className="truck-smoke">
                    <span className="smoke-puff smoke-puff--1" />
                    <span className="smoke-puff smoke-puff--2" />
                    <span className="smoke-puff smoke-puff--3" />
                  </div>

                  <svg
                    width="80"
                    height="48"
                    viewBox="0 0 80 48"
                    fill="none"
                    className="truck-svg"
                  >
                    {/* Cargo container */}
                    <rect
                      x="2"
                      y="8"
                      width="42"
                      height="26"
                      rx="3"
                      fill="url(#cargo-grad)"
                      stroke="#059669"
                      strokeWidth="1.5"
                    />
                    {/* Cargo lines */}
                    <line x1="16" y1="8" x2="16" y2="34" stroke="#059669" strokeOpacity="0.4" strokeWidth="1" />
                    <line x1="30" y1="8" x2="30" y2="34" stroke="#059669" strokeOpacity="0.4" strokeWidth="1" />
                    {/* Cargo label */}
                    <text x="22" y="24" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">VNFT</text>

                    {/* Cabin */}
                    <rect
                      x="44"
                      y="14"
                      width="22"
                      height="20"
                      rx="3"
                      fill="url(#cabin-grad)"
                      stroke="#047857"
                      strokeWidth="1.5"
                    />
                    {/* Window */}
                    <rect
                      x="48"
                      y="17"
                      width="14"
                      height="8"
                      rx="2"
                      fill="#a7f3d0"
                      fillOpacity="0.6"
                      stroke="#059669"
                      strokeWidth="0.8"
                    />
                    {/* Window reflection */}
                    <line x1="50" y1="17" x2="56" y2="25" stroke="white" strokeOpacity="0.3" strokeWidth="1" />

                    {/* Headlight */}
                    <rect x="66" y="26" width="4" height="5" rx="1.5" fill="#fbbf24" />
                    <rect x="66" y="26" width="4" height="5" rx="1.5" fill="url(#headlight-glow)" />

                    {/* Front bumper */}
                    <rect x="66" y="31" width="6" height="3" rx="1" fill="#6b7280" />

                    {/* Rear wheel */}
                    <circle cx="14" cy="37" r="6" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
                    <circle cx="14" cy="37" r="3" fill="#6b7280" />
                    <circle cx="14" cy="37" r="1" fill="#9ca3af" />

                    {/* Front wheel */}
                    <circle cx="54" cy="37" r="6" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
                    <circle cx="54" cy="37" r="3" fill="#6b7280" />
                    <circle cx="54" cy="37" r="1" fill="#9ca3af" />

                    {/* Wheel spokes animation lines */}
                    <g className="wheel-spokes wheel-spokes--rear">
                      <line x1="14" y1="34" x2="14" y2="40" stroke="#9ca3af" strokeWidth="0.5" />
                      <line x1="11" y1="37" x2="17" y2="37" stroke="#9ca3af" strokeWidth="0.5" />
                    </g>
                    <g className="wheel-spokes wheel-spokes--front">
                      <line x1="54" y1="34" x2="54" y2="40" stroke="#9ca3af" strokeWidth="0.5" />
                      <line x1="51" y1="37" x2="57" y2="37" stroke="#9ca3af" strokeWidth="0.5" />
                    </g>

                    {/* Chassis */}
                    <rect x="6" y="33" width="58" height="2" rx="1" fill="#4b5563" />

                    <defs>
                      <linearGradient id="cargo-grad" x1="2" y1="8" x2="2" y2="34">
                        <stop stopColor="#10b981" />
                        <stop offset="1" stopColor="#047857" />
                      </linearGradient>
                      <linearGradient id="cabin-grad" x1="44" y1="14" x2="44" y2="34">
                        <stop stopColor="#34d399" />
                        <stop offset="1" stopColor="#059669" />
                      </linearGradient>
                      <radialGradient id="headlight-glow" cx="0.5" cy="0.5" r="0.5">
                        <stop stopColor="#fbbf24" stopOpacity="0.8" />
                        <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress info */}
        <div className="loading-info">
          <p className="loading-message">{message}</p>
          <div className="loading-percentage">
            <span className="percentage-value">
              {Math.round(Math.min(progress, 100))}
            </span>
            <span className="percentage-sign">%</span>
          </div>
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
