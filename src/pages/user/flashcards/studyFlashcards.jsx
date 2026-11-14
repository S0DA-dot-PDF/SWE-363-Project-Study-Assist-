import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

/*
  FC-04  Study Flashcards
  The cards from FC-03 come in random order. Tap the card to flip it, then mark it:
  slide it left = wrong, slide it right = right (or the side bars, or the ← and → keys).
  A wrong card goes back in at a random later place, until it's answered right.
  When every card is right → "All done!" and Play again (shuffled again). No scoring.
  Menu: back to the library, or the dashboard.
  The cards arrive in the link's state from FC-03: { title, cards, libraryId }
  - Opened without them (typed in or refreshed) → message + back to the set
*/

// TODO(routes): fill in once the FC routes exist in App.jsx
const ROUTES = {
  set: (id) => `/flashcards/${id}`, // FC-03
  library: (id) => `/libraries/${id}`, // LIB-04
  myLibraries: "/libraries",
  dashboard: "/dashboard",
};

const SWIPE_DISTANCE = 100; // how far (px) a card must be dragged to count as an answer
const LEAVE_MS = 250; // how long the card takes to slide away

// Returns a new array in random order (Fisher–Yates shuffle)
function shuffle(list) {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Puts a missed card back at a random place later in the pile:
// never straight next, unless it's the only card left
function putBackLater(rest, card) {
  const earliest = rest.length > 0 ? 1 : 0;
  const index = earliest + Math.floor(Math.random() * (rest.length - earliest + 1));
  return [...rest.slice(0, index), card, ...rest.slice(index)];
}

export default function StudyFlashcards() {
  const { id } = useParams();
  const { state } = useLocation();
  const cards = state?.cards ?? [];

  const [deck, setDeck] = useState(() => shuffle(cards)); // cards still to get right; deck[0] is showing
  const [flipped, setFlipped] = useState(false);
  const [turn, setTurn] = useState(0); // goes up with every answer; the card's key, so each new card starts unflipped
  const [menuOpen, setMenuOpen] = useState(false);

  // Sliding the card
  const [dragStart, setDragStart] = useState(null); // where the finger / mouse went down, while dragging
  const [dragX, setDragX] = useState(0); // how far the card has been dragged (negative = left)
  const [leaving, setLeaving] = useState(null); // "left" | "right" while the card slides away

  const current = deck[0];
  const done = cards.length > 0 && deck.length === 0;

  // Mark the card: it slides away, then the next card comes in
  function answer(isRight) {
    if (!flipped || leaving) return; // look at the answer first
    setLeaving(isRight ? "right" : "left");
    setTimeout(() => {
      const rest = deck.slice(1);
      setDeck(isRight ? rest : putBackLater(rest, current));
      setFlipped(false);
      setLeaving(null);
      setDragX(0);
      setTurn((count) => count + 1);
    }, LEAVE_MS);
  }

  function handlePointerDown(event) {
    if (leaving) return;
    event.currentTarget.setPointerCapture(event.pointerId); // keep following even outside the card
    setDragStart(event.clientX);
  }

  function handlePointerMove(event) {
    if (dragStart === null) return;
    setDragX(event.clientX - dragStart);
  }

  function handlePointerUp() {
    if (dragStart === null) return;
    setDragStart(null);
    if (Math.abs(dragX) < 10) {
      // Barely moved: it was a tap, so flip
      setDragX(0);
      setFlipped(!flipped);
    } else if (flipped && Math.abs(dragX) >= SWIPE_DISTANCE) {
      answer(dragX > 0); // far enough: right = right, left = wrong
    } else {
      setDragX(0); // not far enough, or not flipped yet: spring back
    }
  }

  function playAgain() {
    setDeck(shuffle(cards));
    setFlipped(false);
    setTurn(turn + 1);
  }

  // Keyboard: ← wrong, → right. No dependency list, so it always uses the latest cards.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "ArrowLeft") answer(false);
      if (event.key === "ArrowRight") answer(true);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  // Error / empty: nothing to study
  if (cards.length === 0) {
    return (
      <main className="lib-page">
        <div className="lib-message" role="alert">
          <p>{state ? "This set has no cards to study yet." : "Open a flashcard set to study it."}</p>
          <Link to={ROUTES.set(id)} className="primary-button">
            Go to the flashcard set
          </Link>
        </div>
      </main>
    );
  }

  const libraryLink = state.libraryId ? ROUTES.library(state.libraryId) : ROUTES.myLibraries;

  // The card's look: flipped, being dragged (follows the finger with no delay), or sliding away
  let cardClass = "fc-study-card";
  if (flipped) cardClass += " is-flipped";
  if (dragStart !== null) cardClass += " is-dragging";
  if (leaving) cardClass += ` fc-leave-${leaving}`;

  return (
    <main className="fc-study-page">
      <header className="fc-study-top">
        <div className="fc-menu">
          <button
            type="button"
            className="fc-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="fc-menu-list"
            aria-label="Menu"
          >
            ☰
          </button>
          {menuOpen && (
            <ul id="fc-menu-list" className="fc-menu-list">
              <li>
                <Link to={libraryLink}>Back to library</Link>
              </li>
              <li>
                <Link to={ROUTES.dashboard}>Dashboard</Link>
              </li>
            </ul>
          )}
        </div>
        <h1 className="fc-study-title">{state.title}</h1>
        <p className="fc-study-left">{done ? "" : `${deck.length} left`}</p>
      </header>

      {done ? (
        <section className="fc-study-done" role="status">
          <h2>All done!</h2>
          <p>You got all {cards.length} cards right.</p>
          <button type="button" className="primary-button" onClick={playAgain}>
            Play again
          </button>
        </section>
      ) : (
        <>
          <section className="fc-study-area" aria-label="Flashcard">
            <button
              type="button"
              className={dragX <= -SWIPE_DISTANCE && flipped ? "fc-side fc-side-wrong is-active" : "fc-side fc-side-wrong"}
              onClick={() => answer(false)}
              disabled={!flipped || leaving !== null}
            >
              Wrong
            </button>

            {/* Tap to flip, slide to answer. The face you can't see is hidden from screen readers. */}
            <button
              key={turn}
              type="button"
              className={cardClass}
              style={dragX !== 0 && !leaving ? { transform: `translateX(${dragX}px) rotate(${dragX / 20}deg)` } : undefined}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onClick={(event) => {
                if (event.detail === 0) setFlipped(!flipped); // Enter / Space (taps are handled on pointer up)
              }}
            >
              <span className="fc-study-inner">
                <span className="fc-face fc-face-front" aria-hidden={flipped}>
                  <span className="fc-face-label">Question</span>
                  <span className="fc-face-text">{current.front}</span>
                </span>
                <span className="fc-face fc-face-back" aria-hidden={!flipped}>
                  <span className="fc-face-label">Answer</span>
                  <span className="fc-face-text">{current.back}</span>
                </span>
              </span>
            </button>

            <button
              type="button"
              className={dragX >= SWIPE_DISTANCE && flipped ? "fc-side fc-side-right is-active" : "fc-side fc-side-right"}
              onClick={() => answer(true)}
              disabled={!flipped || leaving !== null}
            >
              Right
            </button>
          </section>

          <p className="fc-study-hint" aria-live="polite">
            {flipped ? "Did you get it? Slide left for wrong, right for right" : "Tap the card to see the answer"}
          </p>
        </>
      )}
    </main>
  );
}
