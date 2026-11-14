import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

/*
  FC-02  Generating Flashcards — the loading screen after FC-01
  Front end only: shows the choices from FC-01 while pretending to generate, then moves on to
  FC-03 Flashcard Set Details. The choices arrive in the link's state:
  { title, cardCount, difficulty, fileNames, libraryId, libraryName, courseCode }
  - Opened without those choices (e.g. typed in or refreshed) → message + back to the form
  - Cancel → back to the form
*/

// TODO(routes): fill in once the FC routes exist in App.jsx
const ROUTES = {
  create: (id) => `/libraries/${id}/flashcards/create`, // FC-01
  setDetails: (setId) => `/flashcards/${setId}`, // FC-03 — "new" until real sets are saved
};

const GENERATING_MS = 4000; // how long the pretend generating takes
const STEPS = ["Reading your materials…", "Finding the key ideas…", "Writing your flashcards…"];
const STEP_MS = GENERATING_MS / STEPS.length;

export default function GeneratingFlashcards() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);

  // Move through the steps, then go to the new set (replace: Back doesn't return to this screen)
  useEffect(() => {
    if (!state) return;

    const stepTimer = setInterval(() => {
      setStepIndex((index) => Math.min(index + 1, STEPS.length - 1));
    }, STEP_MS);
    const doneTimer = setTimeout(() => {
      navigate(ROUTES.setDetails("new"), { replace: true, state });
    }, GENERATING_MS);

    return () => {
      clearInterval(stepTimer);
      clearTimeout(doneTimer); // stop if the user leaves first
    };
  }, [state, navigate]);

  // Error: nothing to generate
  if (!state) {
    return (
      <main className="lib-page">
        <div className="lib-message" role="alert">
          <p>There's nothing to generate. Start from the Create flashcards form.</p>
          <Link to={ROUTES.create(id)} className="primary-button">
            Create flashcards
          </Link>
        </div>
      </main>
    );
  }

  const fileCount = state.fileNames.length;

  return (
    <main className="create-page">
      <div className="create-card fc-generating">
        <span className="fc-spinner" aria-hidden="true" />

        <h1>Generating your flashcards</h1>
        <p>
          {state.cardCount} {state.difficulty} cards for <strong>{state.title}</strong>, from {fileCount}{" "}
          {fileCount === 1 ? "file" : "files"}.
        </p>

        <div className="fc-gen-bar" role="progressbar" aria-label="Generating flashcards">
          <div className="fc-gen-fill" style={{ animationDuration: `${GENERATING_MS}ms` }} />
        </div>
        {/* the key makes each new step fade in */}
        <p key={stepIndex} className="fc-gen-step" aria-live="polite">
          {STEPS[stepIndex]}
        </p>

        <Link to={ROUTES.create(id)} replace>
          Cancel
        </Link>
      </div>
    </main>
  );
}
