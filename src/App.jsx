import { Route, Routes } from "react-router-dom";
import CreateQuiz from "./pages/user/quiz/CreateQuiz.jsx";

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
    </Routes>
  );
}

export default App;