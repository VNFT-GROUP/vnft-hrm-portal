import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ScrollArea } from "./components/ui/scroll-area";
import AppRoutes from "./routes";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <ScrollArea className="h-screen w-screen bg-background text-foreground">
          <div className="app-container">
            <AppRoutes />
          </div>
        </ScrollArea>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
