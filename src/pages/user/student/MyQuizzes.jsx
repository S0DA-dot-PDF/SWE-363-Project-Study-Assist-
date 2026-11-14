
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { getQuizzesForUser } from "../../data";

const QUIZ_DETAILS_ROUTE = (id) => "/quizzes/generated";

export default function MyQuizzes() {
  const [currentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch {
      return null;
    }
  });

  const userId = currentUser?.id;

  const [quizzes, setQuizzes] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selectedLibrary, setSelectedLibrary] = useState("all");

  // Load the student's published quizzes.
  const load = useCallback(async () => {
    if (userId == null) return;

    setStatus("loading");

    try {
      const data = await getQuizzesForUser(userId);
      setQuizzes(data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  // Build the library dropdown from the available quizzes.
  const libraries = useMemo(() => {
    const unique = new Map();

    for (const quiz of quizzes) {
      unique.set(quiz.libraryId, {
        id: quiz.libraryId,
        name: quiz.libraryName,
        courseCode: quiz.courseCode,
      });
    }

    return Array.from(unique.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [quizzes]);

  // Filter quizzes by the selected library.
  const visibleQuizzes = useMemo(
    () =>
      quizzes.filter(
        (quiz) =>
          selectedLibrary === "all" ||
          String(quiz.libraryId) === selectedLibrary
      ),
    [quizzes, selectedLibrary]
  );

  // Redirect users who are not logged in.
  if (userId == null) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="mq-page">
     <Link to="/dashboard" className="back-dashboard">
       ← Back to Dashboard
     </Link>
      <header className="mq-header">
        <h1>My Quizzes</h1>
        <p>Browse published quizzes from your libraries.</p>
      </header>

      {/* Loading state */}
      {status === "loading" && (
        <p className="mq-message" role="status">
          Loading your quizzes…
        </p>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="mq-message" role="alert">
          <p>We couldn't load your quizzes.</p>
          <button
            type="button"
            className="secondary-button"
            onClick={load}
          >
            Try again
          </button>
        </div>
      )}

      {status === "ready" && (
        <>
          {/* Library filter */}
          {quizzes.length > 0 && (
            <div className="mq-toolbar">
              <label htmlFor="mq-library">
                Filter by library
              </label>

              <select
                id="mq-library"
                value={selectedLibrary}
                onChange={(event) =>
                  setSelectedLibrary(event.target.value)
                }
              >
                <option value="all">All Libraries</option>

                {libraries.map((library) => (
                  <option
                    key={library.id}
                    value={String(library.id)}
                  >
                    {library.courseCode} — {library.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Empty state */}
          {visibleQuizzes.length === 0 ? (
            <p className="mq-message">
              No quizzes available yet.
            </p>
          ) : (
            /* Quiz list */
            <ul className="mq-list">
              {visibleQuizzes.map((quiz) => (
                <li key={quiz.id} className="mq-item">
                  <div className="mq-item-info">
                    <strong>{quiz.title}</strong>

                    <span>
                      {quiz.courseCode} · {quiz.libraryName} ·{" "}
                      {quiz.questionCount} questions
                    </span>
                  </div>

                  <Link
                    className="primary-button mq-open"
                    
                    to={QUIZ_DETAILS_ROUTE(quiz.id)}
                  >
                    Open Quiz
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
