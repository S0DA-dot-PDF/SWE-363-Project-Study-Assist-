import { useState } from "react";
import { useLocation, useNavigate, Link} from "react-router-dom";



function QuestionEditor() {
    const location = useLocation();
    const navigate= useNavigate();
    const receivedQuestions =
      location.state?.questions ?? [];
    const [editableQuestions, setEditableQuestions] = useState(receivedQuestions);
function updateQuestionText(questionIndex, newText) {
  const updatedQuestions = [...editableQuestions];

  updatedQuestions[questionIndex] = {
    ...updatedQuestions[questionIndex],
    question: newText,
  };

  setEditableQuestions(updatedQuestions);
}
function updateOption(questionIndex, optionIndex, newText) {
  const updatedQuestions = [...editableQuestions];
  const updatedOptions = [...updatedQuestions[questionIndex].options];

  updatedOptions[optionIndex] = newText;

  updatedQuestions[questionIndex] = {
    ...updatedQuestions[questionIndex],
    options: updatedOptions,
  };

  setEditableQuestions(updatedQuestions);
}
function updateCorrectAnswer(questionIndex, optionIndex) {
  const updatedQuestions = [...editableQuestions];

  updatedQuestions[questionIndex] = {
    ...updatedQuestions[questionIndex],
    correctAnswer: optionIndex,
  };

  setEditableQuestions(updatedQuestions);
}
function deleteQuestion(questionIndex) {
  if (editableQuestions.length === 1) {
    alert("A quiz must contain at least one question.");
    return;
  }

  const remainingQuestions = editableQuestions.filter(
    (_, index) => index !== questionIndex
  );

  setEditableQuestions(remainingQuestions);
}
function isQuizValid() {
  return editableQuestions.every((question) => {
    const questionExists = question.question.trim() !== "";

    const optionsExist = question.options.every(
      (option) => option.trim() !== ""
    );

    const correctAnswerExists =
      question.correctAnswer >= 0 &&
      question.correctAnswer < question.options.length;

    return questionExists && optionsExist && correctAnswerExists;
  });
}
function publishQuiz() {
  if (editableQuestions.length === 0 || !isQuizValid()) {
    alert("Complete every question, option, and correct answer before publishing.");
    return;
  }

  navigate("/quizzes/publish", {
    state: {
      questions: editableQuestions,
    },
  });
}
  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1>Question Editor</h1>
          <p>Edit and review the AI-generated questions.</p>
          <p>Questions: {editableQuestions.length}</p>
        </div>

        <Link to="/dashboard" className="btn btn-outline-primary">
          Home
        </Link>
      </div>
        {editableQuestions.map((question, questionIndex) => (
          <div key={question.id} className="review-card">
            <label htmlFor={`question-${question.id}`}>
              Question {questionIndex + 1}
            </label>

            <input
              id={`question-${question.id}`}
              className="editor-input"
              type="text"
              value={question.question}
              onChange={(event) =>
                updateQuestionText(
                  questionIndex,
                  event.target.value
                )
              }
            />

         <div className="editor-options">
           {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="editor-option-row">
              <input
                type="radio"
                name={`correct-answer-${question.id}`}
                checked={question.correctAnswer === optionIndex}
                onChange={() =>
                  updateCorrectAnswer(questionIndex, optionIndex)
                }
              />

              <span>{["A", "B", "C", "D"][optionIndex]}</span>

              <input
                className="editor-input"
                type="text"
                value={option}
                onChange={(event) =>
                  updateOption(questionIndex, optionIndex, event.target.value)
                }
              />
            </div>
           ))}
         </div>
<button
  type="button"
  className="btn btn-outline-danger btn-sm"
  onClick={() => deleteQuestion(questionIndex)}
>
  Delete Question
</button>
         </div>
         ))}
     <button type="button" className="btn btn-primary" onClick={publishQuiz}>
             Publish Quiz
           </button>
      </div>
    </main>
  );
}

export default QuestionEditor;