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
import MyLibraries from "./pages/user/library/MyLibraries";
import JoinLibrary from "./pages/user/library/JoinLibrary";
import CreateLibrary from "./pages/user/library/CreateLibrary";
import LibraryDetails from "./pages/user/library/LibraryDetails";
import UploadMaterial from "./pages/user/library/UploadMaterial";
import CreateMenu from "./pages/user/library/CreateMenu";
import AISummaries from "./pages/user/student/AISummaries";
import Profile from "./pages/user/shared/Profile";
import Comments from "./pages/user/shared/Comments";
import ReportProblem from "./pages/user/shared/ReportProblem";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import MyQuizzes from "./pages/user/student/MyQuizzes";

function ProtectedRoute({ children }) {
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    return <Navigate to="/login" replace />;
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
        <Route path="/libraries" element={<MyLibraries />} />
        <Route path="/libraries/join" element={<JoinLibrary />} />
        <Route path="/libraries/create" element={<CreateLibrary />} />
        <Route path="/libraries/:id" element={<LibraryDetails />} />
        <Route path="/libraries/:id/upload" element={<UploadMaterial />} />
        <Route path="/libraries/:id/create" element={<CreateMenu />} />
        <Route path="/summaries" element={<AISummaries />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/comments"
          element={
            <ProtectedRoute>
              <Comments />
            </ProtectedRoute>
          }
        />

        <Route
        path="/report-problem"
        element={
          <ProtectedRoute>
            <ReportProblem />
          </ProtectedRoute>
        }
        />

        <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
        />
        <Route
          path="/my-quizzes"
          element={
            <ProtectedRoute>
              <MyQuizzes />
            </ProtectedRoute>
          }
        />
       <Route path="/admin/users" element={<UserManagement />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;