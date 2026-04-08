import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useLayoutStore } from "@/store/useLayoutStore";

export default function CustomCursor() {
  const cursorStyle = useLayoutStore((state) => state.cursorStyle);
  
  // Track mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  // Smooth springs for trailing effects
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(mouseX, springConfig);
  const cursorYSpring = useSpring(mouseY, springConfig);

  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // If default, we don't need all this tracking logic active in DOM
    if (cursorStyle === 'cursor-default') {
      document.body.style.cursor = 'auto';
      // Remove any global hiding class
      document.documentElement.classList.remove('hide-native-cursor');
      return;
    }

    document.documentElement.classList.add('hide-native-cursor');

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      const isClickable = window.getComputedStyle(target).cursor === 'pointer' || 
                          target.tagName.toLowerCase() === 'a' || 
                          target.tagName.toLowerCase() === 'button' ||
                          target.closest('button') || target.closest('a');
      
      setIsHovering(!!isClickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.classList.remove('hide-native-cursor');
    };
  }, [cursorStyle, mouseX, mouseY]);

  if (cursorStyle === 'cursor-default') return null;

  return (
    <>
      <style>{`
        .hide-native-cursor, .hide-native-cursor * {
          cursor: none !important;
        }
      `}</style>
      
      {/* 1. DOT PRESET */}
      {cursorStyle === 'cursor-dot' && (
        <>
          {/* Main small dot tracking exact mouse */}
          <motion.div
            className="fixed top-0 left-0 w-3 h-3 bg-[#F7941D] rounded-full pointer-events-none z-[99999]"
            style={{ 
              x: mouseX, 
              y: mouseY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              scale: isClicking ? 0.5 : isHovering ? 1.5 : 1,
              backgroundColor: isHovering ? "#2E3192" : "#F7941D"
            }}
            transition={{ duration: 0.15 }}
          />
          {/* Outer ring tracking with delay */}
          <motion.div
            className="fixed top-0 left-0 w-10 h-10 border border-[#ab5cf6]/50 rounded-full pointer-events-none z-[99998]"
            style={{ 
              x: cursorXSpring, 
              y: cursorYSpring,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
              opacity: isHovering ? 0.2 : 0.8,
              borderColor: isHovering ? "#2E3192" : "#8b5cf6"
            }}
            transition={{ duration: 0.2 }}
          />
        </>
      )}

      {/* 2. GLOW PRESET */}
      {cursorStyle === 'cursor-glow' && (
        <motion.div
          className="fixed top-0 left-0 w-48 h-48 bg-[#8b5cf6] rounded-full blur-[60px] opacity-30 pointer-events-none z-[9999]"
          style={{ 
            x: cursorXSpring, 
            y: cursorYSpring,
            translateX: "-50%",
            translateY: "-50%",
            mixBlendMode: "screen"
          }}
          animate={{
            scale: isClicking ? 0.8 : isHovering ? 1.2 : 1,
            opacity: isHovering ? 0.5 : 0.3,
            backgroundColor: isHovering ? "#F7941D" : "#8b5cf6"
          }}
        />
      )}
      {cursorStyle === 'cursor-glow' && (
        <motion.div
            className="fixed top-0 left-0 w-1.5 h-1.5 bg-white shadow-xl rounded-full pointer-events-none z-[99999]"
            style={{ 
              x: mouseX, 
              y: mouseY,
              translateX: "-50%",
              translateY: "-50%",
            }}
          />
      )}

      {/* 3. TECH PRESET */}
      {cursorStyle === 'cursor-tech' && (
        <motion.div
          className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-[99999] flex items-center justify-center"
          style={{ 
            x: cursorXSpring, 
            y: cursorYSpring,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            scale: isClicking ? 0.7 : isHovering ? 0.8 : 1,
            rotate: isClicking ? 45 : isHovering ? 90 : 0
          }}
          transition={{ duration: 0.2, type: "spring", stiffness: 200 }}
        >
          {/* Tech crosshairs / brackets */}
          <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 transition-colors ${isHovering ? 'border-[#F7941D]' : 'border-[#2E3192]'}`}></div>
          <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 transition-colors ${isHovering ? 'border-[#F7941D]' : 'border-[#2E3192]'}`}></div>
          <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 transition-colors ${isHovering ? 'border-[#F7941D]' : 'border-[#2E3192]'}`}></div>
          <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 transition-colors ${isHovering ? 'border-[#F7941D]' : 'border-[#2E3192]'}`}></div>
          <motion.div 
             className="w-1.5 h-1.5 bg-[#F7941D] rounded-full"
             animate={{ scale: isHovering ? 0 : 1 }}
          />
        </motion.div>
      )}
    </>
  );
}
