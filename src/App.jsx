import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
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
import QuestionEditor from "./pages/user/quiz/QuestionEditor";
import QuizAnalytics from "./pages/user/educator/QuizAnalytics";
import SupportTickets from "./pages/admin/SupportTickets.jsx";
import Profile from "./pages/user/shared/Profile";
import Comments from "./pages/user/shared/Comments";
import ReportProblem from "./pages/user/shared/ReportProblem";
import AdminDashboard from "./pages/admin/AdminDashboard";
import JoinMatch from "./pages/user/live/joinMatch";
import WaitingRoom from "./pages/user/live/waitingRoom";
import LiveQuestion from "./pages/user/live/liveQuestion";
import PlayerLeaderboard from "./pages/user/live/playerLeaderboard";
import HostLobby from "./pages/user/live/hostLobby";
import HostQuestion from "./pages/user/live/hostQuestion";
import HostLeaderboard from "./pages/user/live/hostLeaderboard";
import UserManagement from "./pages/admin/UserManagement";
import MyQuizzes from "./pages/user/student/MyQuizzes";
import AdvertisementManagement from "./pages/admin/AdvertisementManagement";
import CreateFlashcards from "./pages/user/flashcards/createFlashcards";
import GeneratingFlashcards from "./pages/user/flashcards/generatingFlashcards";
import FlashcardSetDetails from "./pages/user/flashcards/flashcardSetDetails";
import StudyFlashcards from "./pages/user/flashcards/studyFlashcards";
import MyFlashcards from "./pages/user/student/MyFlashcards";

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

function AdminRoute({ children }) {
  const storedUser = localStorage.getItem("currentUser");

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  const currentUser = JSON.parse(storedUser);

  if (currentUser.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
    const [advertisements, setAdvertisements] = useState([]);
    const [activeAdvertisement, setActiveAdvertisement] = useState(null);
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
              <Dashboard activeAdvertisement={activeAdvertisement} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-match"
          element={
            <ProtectedRoute>
              <Navigate to="/live/m-2001/host" replace />
            </ProtectedRoute>
          }
        />
        <Route path="/live/join" element={<ProtectedRoute><JoinMatch /></ProtectedRoute>} />
        <Route path="/live/:matchId/waiting" element={<ProtectedRoute><WaitingRoom /></ProtectedRoute>} />
        <Route path="/live/:matchId/play" element={<ProtectedRoute><LiveQuestion /></ProtectedRoute>} />
        <Route path="/live/:matchId/results" element={<ProtectedRoute><PlayerLeaderboard /></ProtectedRoute>} />
        <Route path="/live/:matchId/host" element={<ProtectedRoute><HostLobby /></ProtectedRoute>} />
        <Route path="/live/:matchId/host/play" element={<ProtectedRoute><HostQuestion /></ProtectedRoute>} />
        <Route path="/live/:matchId/host/results" element={<ProtectedRoute><HostLeaderboard /></ProtectedRoute>} />
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
        <Route path="/libraries/:id/flashcards/create" element={<ProtectedRoute><CreateFlashcards /></ProtectedRoute>} />
        <Route path="/libraries/:id/flashcards/generating" element={<ProtectedRoute><GeneratingFlashcards /></ProtectedRoute>} />
        <Route path="/flashcards/:id/study" element={<ProtectedRoute><StudyFlashcards /></ProtectedRoute>} />
        <Route path="/flashcards/:id" element={<ProtectedRoute><FlashcardSetDetails /></ProtectedRoute>} />
        <Route path="/my-flashcards" element={<ProtectedRoute><MyFlashcards /></ProtectedRoute>} />

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
       <Route
         path="/comments"
         element={<ProtectedRoute><Comments /></ProtectedRoute>}
       />

       <Route
         path="/admin/tickets"
         element={<AdminRoute> <SupportTickets /> </AdminRoute>} />

       <Route
         path="/report-problem"
         element={<ProtectedRoute><ReportProblem /></ProtectedRoute>}
       />

       <Route
         path="/admin-dashboard"
         element={<AdminRoute><AdminDashboard /></AdminRoute>}
       />

       <Route
         path="/admin/advertisements"
         element={
           <AdminRoute>
             <AdvertisementManagement
               advertisements={advertisements}
               setAdvertisements={setAdvertisements}
               setActiveAdvertisement={setActiveAdvertisement}
             />
           </AdminRoute>
         }
       />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;