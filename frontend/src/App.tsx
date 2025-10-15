import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* You can add Navbar or Sidebar later */}
      <Navbar />
      <Outlet />
    </main>
  );
}
