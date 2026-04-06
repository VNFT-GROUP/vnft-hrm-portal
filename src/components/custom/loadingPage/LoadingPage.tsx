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
        <div className="login-heading">
          <h1 className="login-title">VNFT Logistics</h1>
          <p className="login-tagline">HỆ THỐNG ĐANG KHỞI ĐỘNG CƠ SỞ DỮ LIỆU</p>
          <div className="heading-rule" />
        </div>

        <div className="loading-card-custom">
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
