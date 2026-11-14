import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getLibrary } from "../../data";

/*
  FC-01  Create Flashcards — library owners only
  The owner names the set, uploads course materials (PDF or DOCX), and picks how many cards
  and how hard they should be. Front end only: submitting takes these choices to
  FC-02 Generating Flashcards (passed in the link's state).
  - Library not found → message + back to My Libraries
  - Not the owner     → message + back to the library
  - Couldn't load the library → error message with Try again
*/

// TODO(routes): fill in once the FC routes exist in App.jsx
const ROUTES = {
  myLibraries: "/libraries",
  details: (id) => `/libraries/${id}`, // LIB-04
  generating: (id) => `/libraries/${id}/flashcards/generating`, // FC-02
};

// Same file rules as Upload material (FR-13), limited to PDF and DOCX.
// Validation uses the file extension because the browser's file type is unreliable.
const ALLOWED_EXTENSIONS = ["pdf", "docx"];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const CARD_COUNTS = [5, 10, 15, 20];
const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const getExtension = (fileName) => fileName.split(".").pop().toLowerCase();

const formatSize = (bytes) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

// Returns an error message, or "" when the files are fine.
function validateFiles(files) {
  if (files.length === 0) return "Upload at least one course material.";
  if (files.some((file) => !ALLOWED_EXTENSIONS.includes(getExtension(file.name)))) {
    return "Only PDF and DOCX files are allowed.";
  }
  if (files.some((file) => file.size > MAX_SIZE_BYTES)) {
    return `Each file must be ${MAX_SIZE_MB} MB or smaller.`;
  }
  return "";
}

export default function CreateFlashcards() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id ?? 1;
  const { id } = useParams();
  const navigate = useNavigate();

  // Page status: loading | error | notfound | forbidden | ready
  const [status, setStatus] = useState("loading");
  const [library, setLibrary] = useState(null);

  // Form
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [cardCount, setCardCount] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const [errors, setErrors] = useState({ title: "", files: "" });

  // Load the library and check the user owns it
  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const lib = await getLibrary(id, userId);
      if (!lib) {
        setStatus("notfound");
        return;
      }
      setLibrary(lib);
      setStatus(lib.isOwner ? "ready" : "forbidden");
    } catch {
      setStatus("error");
    }
  }, [id, userId]);

  useEffect(() => {
    load();
  }, [load]);

  // ---------- Page-level states ----------
  if (status === "loading") {
    return (
      <main className="lib-page">
        <p className="lib-message" role="status">Loading library…</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="lib-page">
        <div className="lib-message" role="alert">
          <p>We couldn't load this library.</p>
          <button type="button" className="secondary-button" onClick={load}>
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (status === "notfound" || status === "forbidden") {
    return (
      <main className="lib-page">
        <div className="lib-message" role="alert">
          <p>
            {status === "notfound"
              ? "This library doesn't exist, or you don't have access to it."
              : "Only the library owner can create flashcards."}
          </p>
          <Link
            to={status === "notfound" ? ROUTES.myLibraries : ROUTES.details(id)}
            className="primary-button"
          >
            {status === "notfound" ? "Back to My Libraries" : "Back to library"}
          </Link>
        </div>
      </main>
    );
  }

  // ---------- Ready: the form ----------
  function handleTitleChange(event) {
    setTitle(event.target.value);
    setErrors((prev) => ({ ...prev, title: "" }));
  }

  function handleFilesChange(event) {
    const chosen = Array.from(event.target.files);
    const filesError = chosen.length === 0 ? "" : validateFiles(chosen);
    setFiles(filesError ? [] : chosen);
    setErrors((prev) => ({ ...prev, files: filesError }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const titleError = title.trim() ? "" : "Enter a title for this flashcard set.";
    const filesError = validateFiles(files);
    setErrors({ title: titleError, files: filesError });
    if (titleError || filesError) return;

    // FC-02 shows the generating screen; it receives the choices from this form
    navigate(ROUTES.generating(library.id), {
      state: { title: title.trim(), cardCount, difficulty, fileNames: files.map((file) => file.name) },
    });
  }

  return (
    <main className="create-page">
      <div className="create-card">
        <h1>Create flashcards</h1>
        <p>
          Upload course materials and AI will turn them into flashcards for <strong>{library.name}</strong>.
          PDF or DOCX, up to {MAX_SIZE_MB} MB each.
        </p>

        <form className="fc-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="fc-title">Flashcard set title</label>
          <input
            id="fc-title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            maxLength={80}
            placeholder="Example: Chapter 3 key terms"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "fc-title-error" : undefined}
          />
          {errors.title && (
            <p id="fc-title-error" className="error-message" role="alert">
              {errors.title}
            </p>
          )}

          <label htmlFor="fc-files">Course materials — PDF or DOCX</label>
          <input
            id="fc-files"
            type="file"
            accept=".pdf,.docx"
            multiple
            onChange={handleFilesChange}
            aria-invalid={Boolean(errors.files)}
            aria-describedby={errors.files ? "fc-files-error" : undefined}
          />
          {files.length > 0 ? (
            <ul className="fc-file-list">
              {files.map((file) => (
                <li key={`${file.name}-${file.lastModified}`}>
                  {file.name} · {formatSize(file.size)}
                </li>
              ))}
            </ul>
          ) : (
            !errors.files && <p className="fc-hint">No files selected yet.</p>
          )}
          {errors.files && (
            <p id="fc-files-error" className="error-message" role="alert">
              {errors.files}
            </p>
          )}

          <fieldset className="fc-options">
            <legend>Number of cards</legend>
            <div className="fc-option-row">
              {CARD_COUNTS.map((count) => (
                <label key={count} className="fc-option">
                  <input
                    type="radio"
                    name="fc-count"
                    value={count}
                    checked={cardCount === count}
                    onChange={() => setCardCount(count)}
                  />
                  <span>{count} cards</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="fc-options">
            <legend>Difficulty</legend>
            <div className="fc-option-row">
              {DIFFICULTIES.map((level) => (
                <label key={level.value} className="fc-option">
                  <input
                    type="radio"
                    name="fc-difficulty"
                    value={level.value}
                    checked={difficulty === level.value}
                    onChange={() => setDifficulty(level.value)}
                  />
                  <span>{level.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button type="submit">Generate flashcards</button>
        </form>

        <Link to={ROUTES.details(library.id)}>← Back to library</Link>
      </div>
    </main>
  );
}
