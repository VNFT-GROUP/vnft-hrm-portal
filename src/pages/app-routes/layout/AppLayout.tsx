import { Outlet } from "react-router-dom";
import { ScrollArea } from "../../../components/ui/scroll-area";
import Sidebar from "./Sidebar.tsx";
import Topbar from "./Topbar.tsx";
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <ScrollArea className="app-content-scroll">
          <div className="app-content">
            <Outlet />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
