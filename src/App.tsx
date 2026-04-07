import { BrowserRouter } from "react-router-dom";
import { ScrollArea } from "./components/ui/scroll-area";
import AppRoutes from "./routes";

function App() {
  return (
    <BrowserRouter>
      <ScrollArea className="h-screen w-screen bg-background text-foreground">
        <div className="app-container">
          <AppRoutes />
        </div>
      </ScrollArea>
    </BrowserRouter>
  );
}

export default App;
