// src/routes/Routes.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AuthPage from "../pages/auth/AuthPage";
import LandingPage from "../pages/landing/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import JobListings from "../pages/candidate/JobListings";
import CandidateLayout from "../components/layout/CandidateLayout";
import JobDetail from "../pages/candidate/JobDetail";
import ProofWorkspace from "../pages/candidate/ProofWorkspace";
import FeedbackView from "../pages/candidate/FeedbackView";
import Profile from "../pages/candidate/Profile";
import EmployerDashboard from "@/pages/employer/EmployerDashboard";
import EmployerLayout from "@/components/layout/EmployerLayout";
import EmployerHome from "@/pages/employer/EmployerHome";
import CandidateHome from "@/pages/candidate/CandidateHome";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import RequestResetPage from "@/pages/auth/RequestResetPage";
import PostJob from "@/pages/employer/PostJob";
import FeedbackSuccess from "@/pages/employer/FeedbackSuccess";
import EmployerReview from "@/pages/employer/ReviewProof";

export const router = createBrowserRouter([
  // --- Public Landing Page ---
  {
    path: "/",
    element: <LandingPage />,
  },

  // --- Auth Page ---
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/auth/forgot",
    element: <RequestResetPage />,
  },
  {
    path: "/auth/reset",
    element: <ResetPasswordPage />,
  },

  // --- Protected App Routes ---
  {
    path: "/app",
    element: <App />,
    children: [
      // 🎓 Candidate routes
      {
        element: <ProtectedRoute allowedRole="candidate" />,
        children: [
          {
            element: <CandidateLayout />,
            children: [
              { index: true, element: <CandidateHome /> },
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

      // 🏢 Employer routes
      {
        path: "employer",
        element: <ProtectedRoute allowedRole="employer" />,
        children: [
          {
            element: <EmployerLayout />,
            children: [
              { index: true, element: <EmployerHome /> },
              { path: "dashboard", element: <EmployerDashboard /> },
              { path: "review/:id", element: <EmployerReview /> },
              { path: "review/success", element: <FeedbackSuccess /> },
              { path: "jobs/new", element: <PostJob /> },
              { path: "job/:id", element: <JobDetail /> },
            ],
          },
        ],
      },

      // 🧩 Admin routes
      {
        path: "admin",
        element: <ProtectedRoute allowedRole="admin" />,
        children: [{ index: true, element: <AdminDashboard /> }],
      },
    ],
  },
]);
