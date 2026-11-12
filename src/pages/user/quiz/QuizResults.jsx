import { useLocation, useNavigate } from "react-router-dom";


function QuizResults() {
    const navigate = useNavigate();
    const location = useLocation();

    const questions = location.state?.questions ?? [];
    const answers = location.state?.answers ?? [];
    let score = 0;

    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score = score + 1;
      }
    });
const correctCount = score;

const unansweredCount = answers.filter(
  (answer) => answer === null
).length;

const incorrectCount =
  questions.length - correctCount - unansweredCount;
  return (
    <main className="container py-5">
      <div className="bg-white border rounded-4 p-4 mx-auto quiz-form">
        <h1>Quiz Results</h1>
        <p className="fs-4">
          Score: {score} / {questions.length}
        </p>
        <div className="d-flex gap-3 flex-wrap mb-4">
          <span className="text-success">
            Correct: {correctCount}
          </span>

          <span className="text-danger">
            Incorrect: {incorrectCount}
          </span>

          <span className="text-secondary">
            Unanswered: {unansweredCount}
          </span>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/quizzes/generated")}
          >
            Play Again
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/")}
          >
            Back to Library
          </button>
        </div>
      </div>
    </main>
  );
}

export default QuizResults;
