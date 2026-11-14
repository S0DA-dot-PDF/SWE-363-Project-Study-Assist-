import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFlashcardSetsForUser } from "../../data";

export default function MyFlashcards() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id ?? 1;
  const [sets, setSets] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    getFlashcardSetsForUser(userId)
      .then((items) => {
        if (cancelled) return;
        setSets(items);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <main className="lib-page">
      <Link to="/dashboard" className="back-dashboard">
        ← Back to Dashboard
      </Link>
      <header className="lib-header">
        <h1>Play Flashcards</h1>
      </header>

      {status === "loading" && (
        <p className="lib-message" role="status">Loading your flashcards…</p>
      )}

      {status === "error" && (
        <p className="lib-message" role="alert">We couldn’t load your flashcard sets.</p>
      )}

      {status === "ready" && sets.length === 0 && (
        <section className="lib-empty">
          <h2>No flashcard sets yet</h2>
          <p>Open one of your libraries to find available flashcards.</p>
          <Link to="/libraries" className="primary-button">Browse My Libraries</Link>
        </section>
      )}

      {status === "ready" && sets.length > 0 && (
        <ul className="lib-grid">
          {sets.map((set) => (
            <li key={set.id}>
              <Link to={`/flashcards/${set.id}`} className="lib-card">
                <div className="lib-card-top">
                  <span className="lib-course">{set.courseCode}</span>
                  <span>{set.cardCount} cards</span>
                </div>
                <h2 className="lib-card-name">{set.title}</h2>
                <p>{set.libraryName}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}