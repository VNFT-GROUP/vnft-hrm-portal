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
    if (cursorStyle === 'cursor-default') {
      document.body.style.cursor = 'auto';
      document.documentElement.classList.remove('hide-native-cursor');
      return;
    }

    document.documentElement.classList.add('hide-native-cursor');

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      const isClickable = window.getComputedStyle(target).cursor === 'pointer' || 
                          target.tagName.toLowerCase() === 'a' || 
                          target.tagName.toLowerCase() === 'button' ||
                          target.closest('button') || target.closest('a') ||
                          target.closest('[role="button"]');
      
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
      
      {/* 1. CLASSIC PRESET */}
      {cursorStyle === 'cursor-classic' && (
        <>
          <motion.div
            className="fixed top-0 left-0 w-3 h-3 bg-[#F7941D] rounded-full pointer-events-none z-[99999]"
            style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
            animate={{
              scale: isClicking ? 0.5 : isHovering ? 1.5 : 1,
              backgroundColor: isHovering ? "#2E3192" : "#F7941D"
            }}
            transition={{ duration: 0.15 }}
          />
          <motion.div
            className="fixed top-0 left-0 w-10 h-10 border border-[#ab5cf6]/50 rounded-full pointer-events-none z-[99998]"
            style={{ x: cursorXSpring, y: cursorYSpring, translateX: "-50%", translateY: "-50%" }}
            animate={{
              scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
              opacity: isHovering ? 0.2 : 0.8,
              borderColor: isHovering ? "#2E3192" : "#8b5cf6"
            }}
            transition={{ duration: 0.2 }}
          />
        </>
      )}

      {/* 2. INVERTED PRESET */}
      {cursorStyle === 'cursor-inverted' && (
        <>
          <motion.div
            className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[99999]"
            style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%", mixBlendMode: 'difference' }}
            animate={{
              scale: isHovering ? 0 : 1,
            }}
            transition={{ duration: 0.15 }}
          />
          <motion.div
            className="fixed top-0 left-0 w-10 h-10 border-2 border-white bg-white/20 rounded-full pointer-events-none z-[99998]"
            style={{ x: cursorXSpring, y: cursorYSpring, translateX: "-50%", translateY: "-50%", mixBlendMode: 'difference' }}
            animate={{
              scale: isClicking ? 0.8 : isHovering ? 2.5 : 1,
              backgroundColor: isHovering ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)"
            }}
            transition={{ duration: 0.2 }}
          />
        </>
      )}

      {/* 3. PULSE PRESET */}
      {cursorStyle === 'cursor-pulse' && (
        <>
          <motion.div
            className="fixed top-0 left-0 w-3 h-3 bg-[#0ea5e9] rounded-full pointer-events-none z-[99999] shadow-[0_0_10px_#0ea5e9]"
            style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
            animate={{
              scale: isClicking ? 0.8 : isHovering ? 0 : 1,
            }}
          />
          <motion.div
            className="fixed top-0 left-0 w-12 h-12 border-2 border-[#0ea5e9] rounded-full pointer-events-none z-[99998]"
            style={{ x: cursorXSpring, y: cursorYSpring, translateX: "-50%", translateY: "-50%" }}
            animate={{
              scale: isHovering ? 1.5 : 1,
            }}
          />
          <motion.div
            className="fixed top-0 left-0 w-12 h-12 bg-[#0ea5e9]/20 rounded-full pointer-events-none z-[99997]"
            style={{ x: cursorXSpring, y: cursorYSpring, translateX: "-50%", translateY: "-50%" }}
            animate={{
              scale: [1, isHovering ? 2 : 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </>
      )}

      {/* 4. DASHED (TECH) PRESET */}
      {cursorStyle === 'cursor-dashed' && (
        <>
          <motion.div
            className="fixed top-0 left-0 w-2 h-2 bg-[#f43f5e] rounded-sm pointer-events-none z-[99999]"
            style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
            animate={{
              rotate: isHovering ? 45 : 0,
              scale: isClicking ? 0.5 : isHovering ? 1.5 : 1
            }}
          />
          <motion.div
            className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[99998]"
            style={{ 
              x: cursorXSpring, 
              y: cursorYSpring, 
              translateX: "-50%", 
              translateY: "-50%",
              border: "1.5px dashed #f43f5e",
            }}
            animate={{
              rotate: 360,
              scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
              opacity: isHovering ? 0.4 : 1
            }}
            transition={{ 
              rotate: { repeat: Infinity, duration: 8, ease: "linear" },
              scale: { duration: 0.2 }
            }}
          />
        </>
      )}
    </>
  );
}
