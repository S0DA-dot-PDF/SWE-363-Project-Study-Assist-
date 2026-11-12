import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import CreateQuiz from "./pages/user/quiz/CreateQuiz";
import GeneratedQuiz from "./pages/user/quiz/GeneratedQuiz";
import QuizResults from "./pages/user/quiz/QuizResults";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quizzes/create" element={<CreateQuiz />} />
        <Route path="/quizzes/generated" element={<GeneratedQuiz />} />
        <Route path="/quizzes/results" element={<QuizResults />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;