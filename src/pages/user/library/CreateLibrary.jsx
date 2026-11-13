import { useState } from "react";
import { Link } from "react-router-dom";
import { getLibrariesForUser, createLibrary } from "../../data";

// Placeholder routes: keep in sync with MyLibraries.jsx.
const ROUTES = {
  myLibraries: "/libraries",
  details: (id) => `/libraries/${id}`, // LIB-04
};

// userId is a prop for now; later it can come from the auth context.
export default function CreateLibrary() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id ?? 1;
  const [form, setForm] = useState({ name: "", courseCode: "", description: "" });
  const [errors, setErrors] = useState({}); // { name, courseCode }
  const [formError, setFormError] = useState(""); // unexpected failures
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState(null); // the new library, once created
  const [copyState, setCopyState] = useState("idle"); // idle | copied | failed

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error of the field being edited
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const courseCode = form.courseCode.trim();

    // Validation 1: required fields (description is optional)
    const newErrors = {};
    if (!name) newErrors.name = "Library name is required.";
    if (!courseCode) newErrors.courseCode = "Course code is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setBusy(true);
    setFormError("");
    try {
      // Validation 2: name unique among the user's libraries
      const mine = await getLibrariesForUser(userId);
      const duplicate = mine.some(
        (lib) => lib.name.trim().toLowerCase() === name.toLowerCase()
      );
      if (duplicate) {
        setErrors({ name: "You already have a library with this name." });
        return;
      }

      const library = await createLibrary(userId, { ...form });
      setCreated(library);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };
      

      const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(created.joinCode);
            setCopyState("copied");
        } catch {
            setCopyState("failed");
        }
        setTimeout(() => setCopyState("idle"), 2000);
        };


  // Success state: joining code + link to the new library
  if (created) {
    return (
      <main className="create-page">
        <section className="create-card" role="status">
          <h1>Library created</h1>
          <p className="success-message">
            {created.name} ({created.courseCode}) is ready.
          </p>
          <p>Share this joining code with your students:</p>

          <div className="create-code-box">
            <code className="create-code">{created.joinCode}</code>
            <button type="button" className="create-copy" onClick={handleCopy}>
                {copyState === "copied" && "Copied!"}
                {copyState === "failed" && "Copy failed"}
                {copyState === "idle" && "Copy"}
            </button>
          </div>

          <div className="create-actions">
            <Link
              to={ROUTES.details(created.id)}
              className="primary-button create-link"
            >
              Open Library
            </Link>
            <Link to={ROUTES.myLibraries} className="secondary-button create-link">
              Back to My Libraries
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="create-page">
      <section className="create-card">
        <h1>Create a Library</h1>
        <p>Set up a library for your course and share its code with students.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="lib-name">Library name</label>
          <input
            id="lib-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Software Engineering"
            aria-invalid={Boolean(errors.name)}
            aria-describedby="lib-name-error"
          />
          <div id="lib-name-error" aria-live="polite">
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <label htmlFor="lib-course">Course code</label>
          <input
            id="lib-course"
            name="courseCode"
            type="text"
            value={form.courseCode}
            onChange={handleChange}
            placeholder="e.g. SWE363"
            aria-invalid={Boolean(errors.courseCode)}
            aria-describedby="lib-course-error"
          />
          <div id="lib-course-error" aria-live="polite">
            {errors.courseCode && (
              <p className="error-message">{errors.courseCode}</p>
            )}
          </div>

          <label htmlFor="lib-description">Description (optional)</label>
          <textarea
            id="lib-description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="What is this library for?"
          />

          {formError && (
            <p className="error-message" role="alert">
              {formError}
            </p>
          )}

          <button type="submit" disabled={busy}>
            {busy ? "Creating…" : "Create"}
          </button>
        </form>

        <Link to={ROUTES.myLibraries}>Back to My Libraries</Link>
      </section>
    </main>
  );
}