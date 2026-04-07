import { useRef, useEffect, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ScrollArea } from "../../../components/ui/scroll-area";
import Sidebar from "./components/Sidebar.tsx";
import Topbar from "./components/Topbar.tsx";
import ScrollToTopButton from "../../../components/custom/ScrollToTopButton";
import LoadingPage from "../../../components/custom/loadingPage/LoadingPage";
import "./AppLayout.css";

export default function AppLayout() {
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Automatically scroll to the top of the view when the page route changes.
  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main relative">
        <Topbar />
        
        {/* GLOBAL ANIMATED BACKGROUND */}
        <div className="global-bg-anim">
          <div className="global-blob g-blob-1"></div>
          <div className="global-blob g-blob-2"></div>
          <div className="global-blob g-blob-3"></div>
          
          <svg className="global-flow" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0,50 Q25,20 50,50 T100,50" fill="none" stroke="rgba(46,49,146,0.03)" strokeWidth="0.2" className="g-wave-1" />
             <path d="M0,70 Q25,80 50,70 T100,60" fill="none" stroke="rgba(247,148,29,0.02)" strokeWidth="0.2" className="g-wave-2" />
          </svg>
          
          <svg className="global-objects" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
             {/* Giant wireframe objects slowly rotating in background */}
             <circle cx="200" cy="800" r="300" fill="none" stroke="rgba(46,49,146,0.02)" strokeWidth="1" className="g-rotate-1" strokeDasharray="10 20"/>
             <polygon points="800,100 900,300 700,300" fill="none" stroke="rgba(247,148,29,0.02)" strokeWidth="1" className="g-rotate-2" />
             <rect x="700" y="600" width="200" height="200" rx="20" fill="none" stroke="rgba(46,49,146,0.02)" strokeWidth="1" className="g-rotate-3" />
          </svg>
        </div>

        <ScrollArea className="app-content-scroll shadow-inner" viewportRef={scrollViewportRef}>
          <div className="app-content">
            <Suspense fallback={<LoadingPage variant="inner" duration={600} message="Tải phân hệ..." />}>
              <Outlet />
            </Suspense>
          </div>
        </ScrollArea>
        <ScrollToTopButton scrollViewportRef={scrollViewportRef} />
      </div>
    </div>
  );
}
