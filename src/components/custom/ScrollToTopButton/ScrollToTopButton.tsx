import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import "./ScrollToTopButton.css";

interface ScrollToTopButtonProps {
  scrollViewportRef: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollToTopButton({ scrollViewportRef }: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport) return;

    const handleScroll = () => {
      // Logic for scroll tracking inside ScrollArea viewport
      if (viewport.scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [scrollViewportRef]);

  const scrollToTop = () => {
    const viewport = scrollViewportRef.current;
    if (viewport) {
      viewport.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      className={`scroll-to-top-btn ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ChevronUp size={26} className="icon-arrow" strokeWidth={2.5} />
      <span className="sr-only">Scroll to top</span>
    </button>
  );
}
