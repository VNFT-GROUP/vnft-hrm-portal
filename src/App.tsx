import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { LoadingPage } from "./components/custom/loadingPage";
import AppRoutes from "./routes";

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <LoadingPage
        duration={3000}
        onComplete={() => setLoading(false)}
        message="Đang tải hệ thống..."
      />
    );
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
