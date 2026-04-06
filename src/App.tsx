import { useState } from "react";
import { LoadingPage } from "./components/custom/loadingPage";
import { LoginPage } from "./pages/public-routes";

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <LoadingPage
        duration={4000}
        onComplete={() => setLoading(false)}
        message="Đang tải hệ thống..."
      />
    );
  }

  return (
    <div className="app-container">
      <LoginPage />
    </div>
  );
}

export default App;
