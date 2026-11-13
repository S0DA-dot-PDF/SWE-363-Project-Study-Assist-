import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getLibrary, uploadMaterial } from "../../data";

// Placeholder routes: update when App.jsx routing is finalised.
const ROUTES = {
  myLibraries: "/libraries",
  details: (id) => `/libraries/${id}`, // LIB-04
};

// FR-13 rules. Validation uses the file extension because the browser's MIME type is unreliable.
const ALLOWED_EXTENSIONS = ["pdf", "docx", "pptx", "txt"];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const SUCCESS_DELAY_MS = 1200; // how long the success message stays before going back to LIB-04

const getExtension = (fileName) => fileName.split(".").pop().toLowerCase();

// "lecture-1.pdf" -> "lecture-1" (used as the default title)
const stripExtension = (fileName) => fileName.replace(/\.[^.]+$/, "");

const formatSize = (bytes) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

// Returns an error message, or "" when the file is fine.
function validateFile(file) {
  if (!file) return "Choose a file to upload.";
  if (!ALLOWED_EXTENSIONS.includes(getExtension(file.name))) {
    return "Unsupported format. Upload a PDF, DOCX, PPTX or TXT file.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `File is too large. The maximum size is ${MAX_SIZE_MB} MB.`;
  }
  return "";
}

export default function UploadMaterial() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id ?? 1;
  const { id } = useParams();
  const navigate = useNavigate();
  const redirectTimer = useRef(null);

  // Page status: loading | error | notfound | forbidden | ready
  const [status, setStatus] = useState("loading");
  const [library, setLibrary] = useState(null);

  // Form state
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [titleEdited, setTitleEdited] = useState(false); // once true, picking a file no longer overwrites the title
  const [errors, setErrors] = useState({ file: "", title: "" });

  // Upload state: idle | uploading | failed | success
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState(0);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const lib = await getLibrary(id, userId);
      if (!lib) {
        setStatus("notfound");
        return;
      }
      setLibrary(lib);
      // Validation: the user must own the library
      setStatus(lib.isOwner ? "ready" : "forbidden");
    } catch {
      setStatus("error");
    }
  }, [id, userId]);

  useEffect(() => {
    load();
  }, [load]);

  // Don't navigate after the component is gone
  useEffect(() => () => clearTimeout(redirectTimer.current), []);

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
              : "Only the library owner can upload materials."}
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

  // ---------- Ready: the upload form ----------
  const uploading = phase === "uploading";
  const done = phase === "success";
  const locked = uploading || done; // disable inputs while uploading / after success

  const handleFileChange = (e) => {
    const chosen = e.target.files[0] ?? null;
    setPhase("idle"); // clears an earlier "upload failed" message
    if (!chosen) {
      setFile(null);
      setErrors((prev) => ({ ...prev, file: "" }));
      return;
    }
    const fileError = validateFile(chosen);
    setFile(fileError ? null : chosen);
    setErrors((prev) => ({ ...prev, file: fileError }));
    // Default title = file name, unless the user already typed their own
    if (!fileError && !titleEdited) {
      setTitle(stripExtension(chosen.name));
      setErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setTitleEdited(true);
    setErrors((prev) => ({ ...prev, title: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fileError = validateFile(file);
    const titleError = title.trim() ? "" : "Enter a title for this material.";
    setErrors({ file: fileError, title: titleError });
    if (fileError || titleError) return;

    setPhase("uploading");
    setProgress(0);
    try {
      await uploadMaterial(library.id, { name: title.trim(), file }, setProgress);
      setPhase("success");
      redirectTimer.current = setTimeout(() => navigate(ROUTES.details(library.id)), SUCCESS_DELAY_MS);
    } catch {
      setPhase("failed"); // form is kept, so "Try again" just re-submits
    }
  };

  return (
    <main className="create-page">
      <div className="create-card">
        <h1>Upload material</h1>
        <p>
          Add a file to <strong>{library.name}</strong>. Accepted formats: PDF, DOCX, PPTX, TXT (max {MAX_SIZE_MB} MB).
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="material-file">File</label>
          <input
            id="material-file"
            type="file"
            accept=".pdf,.docx,.pptx,.txt"
            onChange={handleFileChange}
            disabled={locked}
            aria-invalid={Boolean(errors.file)}
            aria-describedby={errors.file ? "material-file-error" : undefined}
          />
          {file && !errors.file && (
            <p className="up-file-info">
              {file.name} · {formatSize(file.size)}
            </p>
          )}
          {errors.file && (
            <p id="material-file-error" className="error-message" role="alert">
              {errors.file}
            </p>
          )}

          <label htmlFor="material-title">Title</label>
          <input
            id="material-title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            disabled={locked}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "material-title-error" : undefined}
          />
          {errors.title && (
            <p id="material-title-error" className="error-message" role="alert">
              {errors.title}
            </p>
          )}

          {/* Loading: upload progress */}
          {uploading && (
            <div className="up-progress">
              <div
                className="up-progress-track"
                role="progressbar"
                aria-label="Upload progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div className="up-progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <span>Uploading… {progress}%</span>
            </div>
          )}

          {/* Error: upload failed */}
          {phase === "failed" && (
            <p className="error-message" role="alert">
              Upload failed. Check your connection and try again.
            </p>
          )}

          {/* Success */}
          {done && (
            <p className="success-message" role="status">
              Material uploaded. Taking you back to the library…
            </p>
          )}

          <button type="submit" disabled={locked}>
            {uploading ? "Uploading…" : phase === "failed" ? "Try again" : "Upload"}
          </button>
        </form>

        {!uploading && <Link to={ROUTES.details(library.id)}>← Back to library</Link>}
      </div>
    </main>
  );
}
