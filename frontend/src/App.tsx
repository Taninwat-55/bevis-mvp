import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* You can add Navbar or Sidebar later */}
      <Navbar />
      <Outlet />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontSize: "0.9rem", borderRadius: "8px" },
          success: { iconTheme: { primary: "#6C5CE7", secondary: "white" } },
        }}
      />
    </main>
  );
}
