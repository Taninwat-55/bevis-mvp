// src/routes/Routes.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AuthPage from "../pages/auth/AuthPage";
import LandingPage from "../pages/landing/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import RequestResetPage from "@/pages/auth/RequestResetPage";

// Admin imports
import AdminDashboard from "../pages/admin/AdminDashboard";

// Candidate imports
import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import CandidateJobListings from "../pages/candidate/CandidateJobListings";
import CandidateLayout from "../layout/CandidateLayout";
import CandidateJobDetail from "../pages/candidate/CandidateJobDetail";
import CandidateProofWorkspace from "../pages/candidate/CandidateProofWorkspace";
import CandidateFeedbackView from "../pages/candidate/CandidateFeedbackView";
import CandidateProfile from "../pages/candidate/CandidateProfile";
import CandidateHome from "@/pages/candidate/CandidateHome";

// Employer imports
import EmployerHome from "@/pages/employer/EmployerHome";
import EmployerDashboard from "@/pages/employer/EmployerDashboard";
import EmployerLayout from "@/layout/EmployerLayout";
import EmployerPostJob from "@/pages/employer/EmployerPostJob";
import EmployerFeedbackSuccess from "@/pages/employer/EmployerFeedbackSuccess";
import EmployerReview from "@/pages/employer/EmployerReviewProof";
import EmployerTalentManager from "@/pages/employer/EmployerTalentManager";
import EmployerSubmissions from "@/pages/employer/EmployerSubmissions";
import EmployerJobDetail from "@/pages/employer/EmployerJobDetail";
import EmployerTalentPool from "@/pages/employer/EmployerTalentPool";
import EmployerJobListings from "../pages/employer/EmployerJobListings";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminJobs from "@/pages/admin/AdminJobs";

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
              { path: "jobs", element: <CandidateJobListings /> },
              { path: "job/:id", element: <CandidateJobDetail /> },
              { path: "proof/:id", element: <CandidateProofWorkspace /> },
              { path: "proofs", element: <CandidateFeedbackView /> },
              { path: "profile", element: <CandidateProfile /> },
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
              { path: "review/success", element: <EmployerFeedbackSuccess /> },
              { path: "jobs/new", element: <EmployerPostJob /> },
              { path: "job/:id", element: <EmployerJobDetail /> },
              { path: "jobs", element: <EmployerJobListings /> },
              { path: "submissions", element: <EmployerSubmissions /> },
              { path: "talent", element: <EmployerTalentPool /> },
              { path: "talent/manage", element: <EmployerTalentManager /> },
            ],
          },
        ],
      },

      // 🧩 Admin routes
      {
        path: "admin",
        element: <ProtectedRoute allowedRole="admin" />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "users", element: <AdminUsers /> },
          { path: "jobs", element: <AdminJobs /> },
        ],
      },
    ],
  },
]);
