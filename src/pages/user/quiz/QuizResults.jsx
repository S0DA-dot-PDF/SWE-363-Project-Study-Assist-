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

{/* Individual question review */}
<section className="mt-4 mb-4">
  <h2 className="h4 mb-3">Review Your Answers</h2>

  {questions.map((question, index) => {
    const selectedIndex = answers[index];

    const isUnanswered = selectedIndex == null;

    const isCorrect =
      !isUnanswered &&
      selectedIndex === question.correctAnswer;

    const selectedAnswer = isUnanswered
      ? "Not answered"
      : question.options[selectedIndex];

    const correctAnswer =
      question.options[question.correctAnswer];

    return (
      <div
        key={question.id ?? index}
        className="border rounded p-3 mb-3"
      >
        <h3 className="h6">Question {index + 1}</h3>

        <p>{question.question}</p>

        <p>
          <strong>Status: </strong>
          {isUnanswered
            ? "Unanswered"
            : isCorrect
              ? "Correct"
              : "Incorrect"}
        </p>

        <p>
          <strong>Your Answer: </strong>
          {selectedAnswer}
        </p>

        <p>
          <strong>Correct Answer: </strong>
          {correctAnswer}
        </p>

        {!isCorrect && !isUnanswered && (
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() =>
              navigate("/summaries", {
                state: {
                  mode: "explanation",
                  question: question.question,
                  selectedAnswer,
                  correctAnswer,
                  resultsState: {
                    questions,
                    answers,
                  },
                },
              })
            }
          >
            Explain This Answer
          </button>
        )}
      </div>
    );
  })}
</section>

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
