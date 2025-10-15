import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      {/* 🔹 Simple Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-medium hover:text-indigo-600 ${
                isActive ? "text-indigo-600" : "text-gray-700"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `font-medium hover:text-indigo-600 ${
                isActive ? "text-indigo-600" : "text-gray-700"
              }`
            }
          >
            Dashboard
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
