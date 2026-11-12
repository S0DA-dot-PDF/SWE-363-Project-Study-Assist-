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

  function getOptionClass(question, questionIndex, optionIndex) {
    const selectedAnswer = answers[questionIndex];

    if (optionIndex === question.correctAnswer) {
      return "review-option correct-option";
    }

    if (optionIndex === selectedAnswer) {
      return "review-option wrong-option";
    }

    return "review-option";
  }

function getCardClass(question, questionIndex) {
  const selectedAnswer = answers[questionIndex];

  if (
    selectedAnswer === null ||
    selectedAnswer === undefined
  ) {
    return "review-card unanswered-card";
  }

  if (selectedAnswer === question.correctAnswer) {
    return "review-card correct-card";
  }

  return "review-card incorrect-card";
}

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
        <h2 className="h4">Answer Review</h2>

        {
         questions.map((question, index) =>
         <div key={question.id} className={getCardClass(question, index)}>
           <h3 className="review-card-title">
             Question {index + 1}
           </h3>

           <p>{question.question}</p>
           <div className="review-options">
             {question.options.map((option, optionIndex) => (
               <div key={optionIndex}className={getOptionClass(question, index, optionIndex)}>
                 <strong>
                   {["A", "B", "C", "D"][optionIndex]}.
                 </strong>

                 <span>{option}</span>
                 {optionIndex === question.correctAnswer && (
                   <strong className="correct-answer-label">
                     Correct Answer
                   </strong>
                 )}
               </div>
             ))}
           </div>


         </div>
         )}





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
