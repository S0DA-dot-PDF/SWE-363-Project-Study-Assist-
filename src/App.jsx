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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;