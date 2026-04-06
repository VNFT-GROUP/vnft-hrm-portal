import { useState } from "react";
import { LoadingPage } from "./components/custom/loadingPage";

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
    <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
      <h1 className="text-3xl font-bold tracking-tight">App Portal</h1>
    </div>
  );
}

export default App;
