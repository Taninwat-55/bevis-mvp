// src/routes/Routes.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AuthPage from "../pages/AuthPage";
import JobsTest from "../pages/JobsTest";
import Dashboard from "../pages/Dashboard";
import EmployerReview from "../pages/EmployerReview";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRoute allowedRole="candidate" />,
        children: [
          { index: true, element: <JobsTest /> },
          { path: "dashboard", element: <Dashboard /> },
        ],
      },
      {
        path: "employer",
        element: <ProtectedRoute allowedRole="employer" />,
        children: [{ index: true, element: <EmployerReview /> }],
      },
    ],
  },
  {
    path: "admin",
    element: <ProtectedRoute allowedRole="admin" />,
    children: [{ index: true, element: <AdminDashboard /> }],
  },
]);
