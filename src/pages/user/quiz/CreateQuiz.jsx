import { useState } from "react";

function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [materialFiles, setMaterialFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [questionCount, setQuestionCount]= useState(10);
  const [difficulty, setDifficulty]= useState("medium");

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files);

    const invalidFiles = selectedFiles.filter((file) => {
      const fileName = file.name.toLowerCase();

      return !fileName.endsWith(".pdf") && !fileName.endsWith(".docx");
    });

    if (invalidFiles.length > 0) {
      setMaterialFiles([]);
      setErrors((currentErrors) => ({
        ...currentErrors,
        files: "Only PDF and DOCX files are allowed.",
      }));
      return;
    }

    setMaterialFiles(selectedFiles);
    setErrors((currentErrors) => ({
      ...currentErrors,
      files: "",
    }));
  }

  function validateForm() {
    const newErrors = {};

    if (!quizTitle.trim()) {
      newErrors.title = "Quiz title is required.";
    }

    if (materialFiles.length === 0) {
      newErrors.files = "Upload at least one course material.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!validateForm()) {
      return;
    }

    setMessage(`Ready to generate ${questionCount} ${difficulty} MCQ questions.`);
  }

  return (
    <main className="container py-5">
      <h1>Create Quiz with AI</h1>
      <p>Upload your course materials to generate MCQ questions.</p>

      <form onSubmit={handleSubmit} className="bg-white border rounded-4 p-4 mx-auto quiz-form">
        <div className="mb-3">
          <label htmlFor="quiz-title">Quiz title</label>

          <input
            className="form-control"
            id="quiz-title"
            type="text"
            value={quizTitle}
            onChange={(event) => setQuizTitle(event.target.value)}
            placeholder="Example: Chapter 3 Practice Quiz"
          />

          {errors.title && <p role="alert" className="text-danger mt-1">{errors.title}</p>}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="material-files">
            Course materials — PDF or DOCX
          </label>

          <input
            className="form-control"
            id="material-files"
            type="file"
            accept=".pdf,.docx"
            multiple
            onChange={handleFileChange}
          />

          {errors.files && <p role="alert" className="text-danger mt-1">{errors.files}</p>}
        </div>
        <div className="mb-3">
            <label  className="form-label" htmlFor="quiz-count"> Number of questions</label>
            <select className="form-select" id= "quiz-count" value={questionCount} onChange={(event) => setQuestionCount(Number(event.target.value))}>
                <option value="5"> 5 questions</option>
                <option value="10"> 10 questions</option>
                <option value="15"> 15 questions</option>
                <option value="20"> 20 questions</option>
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label" htmlFor="quiz-difficulty">Difficulty levels: </label>
                <select className="form-select" id= "quiz-difficulty" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
                    <option value="hard"> Hard</option>
                    <option value="medium">Medium</option>
                    <option value="easy"> Easy</option>
                </select>
            <p> Question type: Multiple Choice </p>
            </div>
        {materialFiles.length > 0 && (
          <div className="mb-3">
            <h2>Selected files</h2>

            <ul>
              {materialFiles.map((file) => (
                <li key={`${file.name}-${file.lastModified}`}>
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          Generate Quiz
        </button>

        {message && <p className="text-success mt-3" >{message}</p>}
      </form>
    </main>
  );
}

export default CreateQuiz;
