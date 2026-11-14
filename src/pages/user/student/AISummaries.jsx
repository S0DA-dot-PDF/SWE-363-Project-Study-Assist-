
import { useCallback, useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { getMaterials } from "../../data";

const ROUTES = {
  myLibraries: "/libraries",
  library: (id) => `/libraries/${id}`,
  quizResults: "/quizzes/results",
};

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Temporary mock AI service for the frontend milestone.
// Replace with a real API when the backend is implemented.
async function generateMockResponse(mode, data) {
  await delay(1500);

  if (mode === "summary") {
    return {
      heading: `Summary of ${data.name}`,
      introduction:
        `This is a demonstration summary for "${data.name}". ` +
        "In the completed application, AI will analyze the uploaded " +
        "document and summarize its actual contents.",
      points: [
        "Identify the main topics covered in the study material.",
        "Organize the most important concepts into clear points.",
        "Review the original material for detailed examples and definitions.",
      ],
    };
  }

  return {
    heading: "Answer Explanation",
    introduction:
      `The correct answer is "${data.correctAnswer}". ` +
      `You selected "${data.selectedAnswer}".`,
    points: [
      "Compare your selected answer with the correct answer.",
      "Review the relevant concept in your study materials.",
      "Try answering the question again after reviewing.",
    ],
  };
}

export default function AISummaries() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const materialId = searchParams.get("material");
  const explanationData = location.state;

  const mode =
    explanationData?.mode === "explanation"
      ? "explanation"
      : "summary";

  const [material, setMaterial] = useState(null);
  const [status, setStatus] = useState("loading");
  const [phase, setPhase] = useState("idle");
  const [result, setResult] = useState(null);

  // Find the material using the existing mock-data function.
  const loadMaterial = useCallback(async () => {
    if (mode === "explanation") {
      const valid =
        explanationData?.question &&
        explanationData?.correctAnswer != null &&
        explanationData?.selectedAnswer != null;

      setStatus(valid ? "ready" : "invalid");
      return;
    }

    setStatus("loading");

    if (!materialId) {
      setStatus("invalid");
      return;
    }

    try {
      // Current mock data doesn't have getMaterial(id).
      // The materials are retrieved using their library ID.
      const libraryId = searchParams.get("library");

      if (!libraryId) {
        setStatus("invalid");
        return;
      }

      const materials = await getMaterials(Number(libraryId));

      const found = materials.find(
        (item) => String(item.id) === String(materialId)
      );

      if (!found) {
        setStatus("notfound");
        return;
      }

      setMaterial(found);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [mode, materialId, searchParams, explanationData]);

  useEffect(() => {
    loadMaterial();
  }, [loadMaterial]);

  const handleGenerate = async () => {
    setPhase("generating");
    setResult(null);

    try {
      const data =
        mode === "summary" ? material : explanationData;

      const response = await generateMockResponse(mode, data);

      setResult(response);
      setPhase("success");
    } catch {
      setPhase("error");
    }
  };

  const libraryId = searchParams.get("library");

  const backRoute =
    mode === "summary" && libraryId
      ? ROUTES.library(libraryId)
      : mode === "explanation"
        ? ROUTES.quizResults
        : ROUTES.myLibraries;

  if (status === "loading") {
    return (
      <main className="lib-page">
        <p className="lib-message" role="status">
          Loading study material…
        </p>
      </main>
    );
  }

  if (status !== "ready") {
    return (
      <main className="lib-page">
        <div className="lib-message" role="alert">
          <p>
            {status === "notfound"
              ? "The selected material could not be found."
              : status === "error"
                ? "We couldn't load the study material."
                : "The information required for this page is missing."}
          </p>

          {status === "error" && (
            <button
              type="button"
              className="secondary-button"
              onClick={loadMaterial}
            >
              Try again
            </button>
          )}

          <Link
            to={ROUTES.myLibraries}
            className="primary-button"
          >
            Back to My Libraries
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="lib-page">
      <Link
        to={backRoute}
        className="det-back"
        onClick={(event) => {
          // Restore QuizResults state when returning.
          if (
            mode === "explanation" &&
            explanationData?.resultsState
          ) {
            event.preventDefault();
            navigate(backRoute, {
              state: explanationData.resultsState,
            });
          }
        }}
      >
        ← {mode === "summary"
          ? "Back to Library"
          : "Back to Quiz Results"}
      </Link>

      <header className="ai-header">
        <h1>
          {mode === "summary"
            ? "AI Study Assistant"
            : "AI Answer Explanation"}
        </h1>

        <p>
          {mode === "summary"
            ? "Understand your study materials faster with AI."
            : "Understand your mistakes and learn the correct concepts."}
        </p>
      </header>

      <section className="ai-card">
        {mode === "summary" ? (
          <>
            <h2>Selected Material</h2>

            <div className="ai-material">
              <span className="ai-file-icon" aria-hidden="true">
                PDF
              </span>

              <div>
                <strong>{material.name}</strong>
                <p>{material.fileName}</p>
              </div>
            </div>

            <p>
              Generate a summary of this study material.
            </p>
          </>
        ) : (
          <>
            <h2>Question</h2>

            <p className="ai-question">
              {explanationData.question}
            </p>

            <div className="ai-answer ai-incorrect">
              <strong>Your Answer</strong>
              <p>{explanationData.selectedAnswer}</p>
            </div>

            <div className="ai-answer ai-correct">
              <strong>Correct Answer</strong>
              <p>{explanationData.correctAnswer}</p>
            </div>
          </>
        )}

        <button
          type="button"
          className="primary-button ai-generate"
          onClick={handleGenerate}
          disabled={phase === "generating"}
        >
          {phase === "generating"
            ? "Generating…"
            : mode === "summary"
              ? "Generate Summary"
              : "Explain This Answer"}
        </button>

        {phase === "generating" && (
          <p className="ai-loading" role="status">
            Generating… Please wait.
          </p>
        )}

        {phase === "error" && (
          <p className="error-message" role="alert">
            AI generation failed. Please try again.
          </p>
        )}
      </section>

      {phase === "success" && result && (
        <section className="ai-card ai-result" aria-live="polite">
          <h2>{result.heading}</h2>

          <p>{result.introduction}</p>

          <h3>Key Points</h3>

          <ul>
            {result.points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>

          <p className="ai-disclaimer">
            Demo response: AI-generated content is simulated
            for this frontend prototype.
          </p>

          <button
            type="button"
            className="secondary-button"
            onClick={handleGenerate}
          >
            Try Again
          </button>
        </section>
      )}
    </main>
  );
}
