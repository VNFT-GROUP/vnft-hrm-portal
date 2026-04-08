import { BrowserRouter } from "react-router-dom";
import { ScrollArea } from "./components/ui/scroll-area";
import AppRoutes from "./routes";
import { useLayoutStore } from "./store/useLayoutStore";
import { useEffect } from "react";

function App() {
  const appFont = useLayoutStore((state) => state.appFont);

  useEffect(() => {
    // Remove existing font classes to prevent conflicts
    document.body.classList.remove('font-roboto', 'font-inter', 'font-be-vietnam-pro', 'font-montserrat', 'font-nunito');
    // Add current font class
    if (appFont) {
      document.body.classList.add(appFont);
    }
  }, [appFont]);

  return (
    <BrowserRouter>
      <ScrollArea className={`h-screen w-screen bg-background text-foreground ${appFont}`}>
        <div className="app-container">
          <AppRoutes />
        </div>
      </ScrollArea>
    </BrowserRouter>
  );
}

export default App;
