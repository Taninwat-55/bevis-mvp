// src/routes/Routes.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AuthPage from "../pages/auth/AuthPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import JobListings from "../pages/candidate/JobListings";
import CandidateLayout from "../components/layout/CandidateLayout";
import JobDetail from "../pages/candidate/JobDetail";
import ProofWorkspace from "../pages/candidate/ProofWorkspace";
import FeedbackView from "../pages/candidate/FeedbackView";
import Profile from "../pages/candidate/Profile";

export const router = createBrowserRouter([
  // --- Public Routes ---
  {
    path: "/auth",
    element: <AuthPage />,
  },

  // --- Protected Routes ---
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRoute allowedRole="candidate" />,
        children: [
          {
            element: <CandidateLayout />, // 🧱 Layout wrapper
            children: [
              { index: true, element: <CandidateDashboard /> },
              { path: "dashboard", element: <CandidateDashboard /> },
              { path: "jobs", element: <JobListings /> },
              { path: "job/:id", element: <JobDetail /> },
              { path: "proof/:id", element: <ProofWorkspace /> },
              { path: "proofs", element: <FeedbackView /> },
              { path: "profile", element: <Profile /> },
            ],
          },
        ],
      },
      // {
      //   path: "employer",
      //   element: <ProtectedRoute allowedRole="employer" />,
      //   children: [
      //     { index: true, element: <EmployerDashboard /> },
      //   ],
      // },
      {
        path: "admin",
        element: <ProtectedRoute allowedRole="admin" />,
        children: [{ index: true, element: <AdminDashboard /> }],
      },
    ],
  },
]);
