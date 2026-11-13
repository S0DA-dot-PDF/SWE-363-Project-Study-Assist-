import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
const generatedQuestions = [
  {
    id: "1",
    question: "Which HTML element represents the main content of a webpage?",
    options: ["<header>", "<main>","<footer>", "<div>"],
    correctAnswer: 1
  },
  {
    id: "2",
    question: "Which CSS property changes the text color?",
    options: ["color", "font-style", "background", "display"],
    correctAnswer: 0
  }
];
const quizDuration = 60;
function GeneratedQuiz() {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem("currentUser");

    const currentUser = storedUser
      ? JSON.parse(storedUser)
      : null;

    const isEducator = currentUser?.role === "educator";
    const [currentQuestionIndex, setCurrentQuestionIndex]= useState(0);
    const [answers, setAnswers] = useState(Array(generatedQuestions.length).fill(null));
    const [timeRemaining, setTimeRemaining] = useState(quizDuration);
    const timePercentage =
      (timeRemaining / quizDuration) * 100;
    const currentQuestion= generatedQuestions[currentQuestionIndex];
    function goToPreviousQuestion() {
      setCurrentQuestionIndex((currentIndex) => currentIndex - 1);
    };

    function goToNextQuestion() {
      setCurrentQuestionIndex((currentIndex) => currentIndex + 1);
    };
function submitQuiz() {
  navigate("/quizzes/results", {
    state: {
      questions: generatedQuestions,
      answers: answers,
    },
  });
};
useEffect(() => {
  if (timeRemaining === 0) {
    submitQuiz();
    return;
  }

  const timer = setTimeout(() => {
    setTimeRemaining((currentTime) => currentTime - 1);
  }, 1000);

  return () => clearTimeout(timer);
}, [timeRemaining]);
  return (
    <main className="container py-5">
      <div className="bg-white border rounded-4 p-4 mx-auto quiz-form">
        <div className="d-flex justify-content-between align-items-center gap-2">
          <h1>Generated Quiz</h1>

          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={!isEducator}
            onClick={() => {
              console.log("Sending questions:", generatedQuestions);

              navigate("/quizzes/editor", {
                state: {
                  questions: generatedQuestions,
                },
              });
            }}
          >
            Edit Quiz
          </button>
        </div>
        <p className="mb-2">
          Time remaining: {timeRemaining} seconds
        </p>

        <div
          className="progress mb-4"
          role="progressbar"
          aria-valuenow={timeRemaining}
          aria-valuemin="0"
          aria-valuemax={quizDuration}
        >
          <div
            className="progress-bar"
            style={{ width: `${timePercentage}%` }}
          />
        </div>
        <p className="text-muted">
            question {currentQuestionIndex+1} of {generatedQuestions.length} </p>
        <h2 className="h4 mb-4">
          {currentQuestion.question}
        </h2>
        <div className="mb-4">
            {currentQuestion.options.map((option, optionIndex) => (
                <label key={optionIndex} className= "form-check border rounded p-3 mb-2">
                <input
                        className="form-check-input"
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        checked={answers[currentQuestionIndex] === optionIndex}
                        onChange={() => {
                          const updatedAnswers = [...answers];
                          updatedAnswers[currentQuestionIndex] = optionIndex;
                          setAnswers(updatedAnswers);
                        }}
                />
                <span className="form-check-label ms-2">
                        {["A", "B", "C", "D"][optionIndex]}. {option}
                </span>
                </label>
                ))}
      </div>
      <div className="d-flex justify-content-between">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={goToNextQuestion}
          disabled={currentQuestionIndex === generatedQuestions.length - 1}
        >
          Next
        </button>
      </div>
      <button
        type="button"
        className="btn btn-success"
        onClick={submitQuiz}
      >
        Submit Quiz
      </button>
      </div>
    </main>
  );
}

export default GeneratedQuiz;
