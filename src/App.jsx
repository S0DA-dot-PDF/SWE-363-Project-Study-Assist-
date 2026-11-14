import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import SignUp from "./pages/public/SignUp";
import VerifyEmail from "./pages/public/VerifyEmail";
import ResetPassword from "./pages/public/ResetPassword";
import NotFound from "./pages/public/NotFound";
import Dashboard from "./pages/user/shared/Dashboard";
import CreateQuiz from "./pages/user/quiz/CreateQuiz";
import GeneratedQuiz from "./pages/user/quiz/GeneratedQuiz";
import QuizResults from "./pages/user/quiz/QuizResults";
import QuestionEditor from "./pages/user/quiz/QuestionEditor";
import QuizAnalytics from "./pages/user/educator/QuizAnalytics";
import SupportTickets from "./pages/admin/SupportTickets.jsx";
import Profile from "./pages/user/shared/Profile";
import Comments from "./pages/user/shared/Comments";
import ReportProblem from "./pages/user/shared/ReportProblem";
import AdminDashboard from "./pages/admin/AdminDashboard";

function ProtectedRoute({ children }) {
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function EducatorRoute({ children }) {
  const storedUser = localStorage.getItem("currentUser");

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  const currentUser = JSON.parse(storedUser);

  if (currentUser.role !== "educator") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/create"
          element={
              <ProtectedRoute>
              <CreateQuiz />
              </ProtectedRoute>
          }
        />

        <Route
          path="/quizzes/generated"
          element={
              <ProtectedRoute>
              <GeneratedQuiz />
              </ProtectedRoute>
          }
        />

        <Route
          path="/quizzes/results"
          element={
              <ProtectedRoute>
              <QuizResults />
              </ProtectedRoute>
          }
        />

       <Route
         path="/quizzes/editor"
         element={<EducatorRoute><QuestionEditor /></EducatorRoute>}
       />

       <Route
         path="/profile"
         element={<ProtectedRoute><Profile /></ProtectedRoute>}
       />

       <Route
         path="/educator/analytics"
         element={<EducatorRoute><QuizAnalytics /></EducatorRoute>}
       />

       <Route
         path="/comments"
         element={<ProtectedRoute><Comments /></ProtectedRoute>}
       />

       <Route
         path="/admin/supportTickets"
         element={<ProtectedRoute><SupportTickets /></ProtectedRoute>}
       />

       <Route
         path="/report-problem"
         element={<ProtectedRoute><ReportProblem /></ProtectedRoute>}
       />

       <Route
         path="/admin-dashboard"
         element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
       />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;