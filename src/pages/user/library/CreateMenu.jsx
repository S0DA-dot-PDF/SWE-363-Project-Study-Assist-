
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLibrary } from "../../data";

// Temporary destination routes.
// Confirm these with the teammates responsible for QZ-01 and FC-01.
const ROUTES = {
  myLibraries: "/libraries",
  details: (id) => `/libraries/${id}`,
  createQuiz: (id) => `/libraries/${id}/quizzes/create`,
  createFlashcards: (id) => `/libraries/${id}/flashcards/create`,
};

export default function CreateMenu() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id;

  const { id } = useParams();

  const [library, setLibrary] = useState(null);
  const [status, setStatus] = useState("loading");

  // Load the library and verify ownership.
  const load = useCallback(async () => {
    setStatus("loading");

    if (userId == null) {
      setStatus("forbidden");
      return;
    }

    try {
      const lib = await getLibrary(id, userId);

      if (!lib) {
        setStatus("notfound");
        return;
      }

      setLibrary(lib);

      if (!lib.isOwner) {
        setStatus("forbidden");
        return;
      }

      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [id, userId]);

  useEffect(() => {
    load();
  }, [load]);

  // Loading state
  if (status === "loading") {
    return (
      <main className="lib-page">
        <p className="lib-message" role="status">
          Loading library…
        </p>
      </main>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <main className="lib-page">
        <div className="lib-message" role="alert">
          <p>We couldn't load this library.</p>

          <button
            type="button"
            className="secondary-button"
            onClick={load}
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  // Library not found or access denied
  if (status === "notfound" || status === "forbidden") {
    return (
      <main className="lib-page">
        <div className="lib-message" role="alert">
          <p>
            {status === "notfound"
              ? "This library doesn't exist, or you don't have access to it."
              : "Only the library owner can create quizzes and flashcards."}
          </p>

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

  // Ready state: display creation options
  return (
    <main className="lib-page">
      <Link
        to={ROUTES.details(library.id)}
        className="det-back"
      >
        ← Back to library
      </Link>

      <header className="cm-header">
        <span className="lib-course">
          {library.courseCode}
        </span>

        <h1>Create Content</h1>

        <p>
          Choose what you want to create in{" "}
          <strong>{library.name}</strong>.
        </p>
      </header>

      <section
        className="cm-grid"
        aria-label="Content creation options"
      >
        <Link
          to={ROUTES.createQuiz(library.id)}
          className="cm-card"
        >
          <div className="cm-icon" aria-hidden="true">
            ?
          </div>

          <h2>Create Quiz</h2>

          <p>
            Create questions manually or generate
            a quiz using AI from your materials.
          </p>

          <span className="cm-card-action">
            Create Quiz →
          </span>
        </Link>

        <Link
          to={ROUTES.createFlashcards(library.id)}
          className="cm-card"
        >
          <div className="cm-icon" aria-hidden="true">
            ≡
          </div>

          <h2>Create Flashcards</h2>

          <p>
            Create flashcards with terms and
            definitions or generate them using AI.
          </p>

          <span className="cm-card-action">
            Create Flashcards →
          </span>
        </Link>
      </section>
    </main>
  );
}
