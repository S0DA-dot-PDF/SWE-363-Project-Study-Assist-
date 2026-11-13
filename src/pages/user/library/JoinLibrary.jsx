import { useState } from "react";
import { Link } from "react-router-dom";
import { getLibraryByCode, joinLibrary } from "../../data";

// Placeholder routes: keep in sync with MyLibraries.jsx.
const ROUTES = {
  myLibraries: "/libraries",
  details: (id) => `/libraries/${id}`, // LIB-04
};


export default function JoinLibrary() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id ?? 1;
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // null | { type: "member" | "joined", library }
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setCode(e.target.value);
    setError("");
    setResult(null); // typing a new code resets the page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = code.trim();

    // Validation 1: code not empty
    if (!trimmed) {
      setError("Please enter a joining code.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const library = await getLibraryByCode(trimmed, userId);

      // Validation 2: library exists
      if (!library) {
        setError("That code isn't valid. Check it and try again.");
        return;
      }

      // Validation 3: not already a member -> button becomes "Open Library"
      if (library.isMember) {
        setResult({ type: "member", library });
        return;
      }

      // Validation 4: library accepts members
      if (!library.acceptingMembers) {
        setError("This library isn't accepting new members right now.");
        return;
      }

      await joinLibrary(library.id, userId);
      setResult({ type: "joined", library });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="join-page">
      <section className="join-card">
        <h1>Join a Library</h1>
        <p>Enter the joining code you received from your educator.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="join-code">Joining code</label>
          <input
            id="join-code"
            type="text"
            value={code}
            onChange={handleChange}
            placeholder="e.g. SWE363-AB12"
            autoComplete="off"
            aria-invalid={Boolean(error)}
            aria-describedby="join-feedback"
          />

          <div id="join-feedback" aria-live="polite">
            {error && <p className="error-message">{error}</p>}
            {result?.type === "member" && (
              <p className="success-message">
                You're already a member of {result.library.name}.
              </p>
            )}
            {result?.type === "joined" && (
              <p className="success-message">
                You joined {result.library.name}!
              </p>
            )}
          </div>

          {result ? (
            <Link
              to={ROUTES.details(result.library.id)}
              className="primary-button join-button"
            >
              Open Library
            </Link>
          ) : (
            <button type="submit" disabled={busy}>
              {busy ? "Joining…" : "Join"}
            </button>
          )}
        </form>

        <Link to={ROUTES.myLibraries}>Back to My Libraries</Link>
      </section>
    </main>
  );
}