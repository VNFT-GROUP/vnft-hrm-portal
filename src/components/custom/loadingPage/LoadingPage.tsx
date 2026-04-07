import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import AnimatedLogisticsBackground from "../../../pages/public-routes/login/components/AnimatedLogisticsBackground";
import LoginHeader from "../../../pages/public-routes/login/components/LoginHeader";
import LoginFooter from "../../../pages/public-routes/login/components/LoginFooter";
import "../../../pages/public-routes/login/LoginPage.css"; /* Ensure layout styles are loaded */
import "./LoadingPage.css";

interface LoadingPageProps {
  duration?: number;
  onComplete?: () => void;
  message?: string;
}

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

  return (
    <div className="login-page">
      <AnimatedLogisticsBackground />
      <LoginHeader />

      <div className="login-wrapper">
        <div className="loading-card-custom">
          <div className="progress-truck-wrapper" style={{ width: `${clampedProgress}%` }}>
            <div className="progress-truck-icon">
              <svg width="32" height="18" viewBox="0 0 80 48" fill="none">
                <rect x="2" y="8" width="45" height="28" rx="3" fill="#F7941D" />
                <rect x="49" y="14" width="22" height="22" rx="3" fill="#2E3192" />
                <rect x="54" y="18" width="12" height="10" rx="1.5" fill="#f8fafc" opacity="0.9" />
                <circle cx="14" cy="39" r="6" fill="#1e293b" />
                <circle cx="60" cy="39" r="6" fill="#1e293b" />
                <circle cx="14" cy="39" r="2.5" fill="#e2e8f0" />
                <circle cx="60" cy="39" r="2.5" fill="#e2e8f0" />
              </svg>
            </div>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${clampedProgress}%` }} />
          </div>
          <div className="progress-meta">
            <span className="loading-message">{message}</span>
            <span className="progress-pct">{Math.round(clampedProgress)}%</span>
          </div>
        </div>
      </div>

      <LoginFooter />
    </div>
  );
}
