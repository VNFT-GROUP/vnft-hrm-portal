import { useLayoutStore } from "@/store/useLayoutStore";

export default function CustomCursor() {
  const cursorStyle = useLayoutStore((state) => state.cursorStyle);

  if (cursorStyle === 'cursor-default') return null;

  let fill = "white";
  let stroke = "black";
  let filter = "";

  if (cursorStyle === 'cursor-vnft') { fill = "%23F7941D"; stroke = "%232E3192"; }
  if (cursorStyle === 'cursor-dark') { fill = "%231E2062"; stroke = "white"; }
  if (cursorStyle === 'cursor-neon') { 
    fill = "%230ea5e9"; 
    stroke = "white"; 
    filter = `<defs><filter id="g"><feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="%230ea5e9"/></filter></defs>`;
  }
  if (cursorStyle === 'cursor-rose') { fill = "%23f43f5e"; stroke = "white"; }

  const path = filter ? `<path d="M5.5 3L21.5 14L13.5 15.5L9.5 22.5L5.5 3Z" fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round" filter="url(%23g)" />` : `<path d="M5.5 3L21.5 14L13.5 15.5L9.5 22.5L5.5 3Z" fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round" />`;
  const svg = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E${filter}${path}%3C/svg%3E`;

  // Pointer version (hand)
  const handPath = filter ? `<path d="M12.95 11.53V6.26C12.95 5.02 13.96 4 15.21 4C16.46 4 17.47 5.02 17.47 6.26V12.29M17.47 9.27V7.01C17.47 5.76 18.48 4.75 19.73 4.75C20.98 4.75 22 5.76 22 7.01V14.93M22 11.53V10.03C22 8.78 23.01 7.76 24.26 7.76C25.51 7.76 26.53 8.78 26.53 10.03V17.57C26.53 20.91 23.83 23.63 20.49 23.63H15.97C13.28 23.63 10.8 21.86 10 19.28L8.53 14.49C8.19 13.38 8.94 12.19 10.09 11.98C11.09 11.79 12.08 12.36 12.49 13.29L12.95 14.2V11.53Z" fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round" filter="url(%23g)" />` : `<path d="M12.95 11.53V6.26C12.95 5.02 13.96 4 15.21 4C16.46 4 17.47 5.02 17.47 6.26V12.29M17.47 9.27V7.01C17.47 5.76 18.48 4.75 19.73 4.75C20.98 4.75 22 5.76 22 7.01V14.93M22 11.53V10.03C22 8.78 23.01 7.76 24.26 7.76C25.51 7.76 26.53 8.78 26.53 10.03V17.57C26.53 20.91 23.83 23.63 20.49 23.63H15.97C13.28 23.63 10.8 21.86 10 19.28L8.53 14.49C8.19 13.38 8.94 12.19 10.09 11.98C11.09 11.79 12.08 12.36 12.49 13.29L12.95 14.2V11.53Z" fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round" />`;
  const pointerSvg = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E${filter}${handPath}%3C/svg%3E`;

  return (
    <style>{`
      body, html {
        cursor: url('${svg}') 5 3, auto !important;
      }
      
      a, button, [role="button"], label, .cursor-pointer,
      select, summary, input[type="submit"], input[type="button"],
      input[type="checkbox"], input[type="radio"] {
        cursor: url('${pointerSvg}') 10 3, pointer !important;
      }
      
      /* Restoring necessary specific cursors to override global setup */
      input[type="text"], input[type="password"], input[type="email"], input[type="number"], textarea, .cursor-text {
        cursor: text !important;
      }
      .cursor-grab { cursor: grab !important; }
      .cursor-move { cursor: move !important; }
      .cursor-col-resize { cursor: col-resize !important; }
      .cursor-row-resize { cursor: row-resize !important; }
      .cursor-not-allowed, :disabled { cursor: not-allowed !important; }
    `}</style>
  );
}
