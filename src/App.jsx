import { Route, Routes } from "react-router-dom";
import CreateQuiz from "./pages/user/quiz/CreateQuiz.jsx";
import GeneratedQuiz from "./pages/user/quiz/GeneratedQuiz.jsx";
import QuizResults from "./pages/user/quiz/QuizResults.jsx";
function Home() {
  return (
    <main>
      <h1>Study Assist</h1>
      <a href="/quizzes/create">Create Quiz</a>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quizzes/create" element={<CreateQuiz />} />
      <Route path="/quizzes/generated" element={<GeneratedQuiz />} />
      <Route path="/quizzes/results" element={<QuizResults />} />
    </Routes>
  );
}

export default App;