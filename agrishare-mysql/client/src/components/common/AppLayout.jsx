import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx"; // Added extension and corrected path
import Navbar from "./Navbar.jsx";   // Added extension and corrected path

export default function AppLayout({ title, subtitle }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title={title} subtitle={subtitle} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}