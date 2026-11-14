import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteFlashcardSet, getFlashcardSet } from "../../data";
import { mockFlashcardCards } from "../../data/mockContent";

/*
  FC-03  Flashcard Set Details
  Shows one flashcard set: its library, title, details and every card (question and answer).
  Flashcards are personal: only their owner can open them, and the owner can
  edit, delete and add cards, delete the whole set, and study it (FC-04).
  Two ways in, same address /flashcards/:id
  - A new set straight after FC-02 → /flashcards/new, with the FC-01 choices in the link's state
  - A saved set pressed in the library (LIB-04) → /flashcards/1, read from the data
  Front end only: the cards are sample cards, and card changes stay on this page until saving exists.
  - Not found, not the owner, or /flashcards/new opened without choices → message + back to My Libraries
  - Couldn't load → error message with Try again
*/

// TODO(routes): fill in once the FC routes exist in App.jsx
const ROUTES = {
  myLibraries: "/libraries",
  library: (id) => `/libraries/${id}`, // LIB-04
  study: (setId) => `/flashcards/${setId}/study`, // FC-04
};

// TODO(data): sample cards until real generated cards exist. A set shows the first `cardCount` of them.
const capitalise = (word) => word.charAt(0).toUpperCase() + word.slice(1);

export default function FlashcardSetDetails() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id ?? 1;
  const { id } = useParams();
  const { state } = useLocation(); // a new set's choices, from FC-02
  const navigate = useNavigate();
  const isNew = id === "new";

  // Page status: loading | error | notfound | ready
  const [status, setStatus] = useState("loading");
  const [set, setSet] = useState(null);
  const [cards, setCards] = useState([]);

  // Editing one card at a time
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ front: "", back: "" });
  const [draftError, setDraftError] = useState("");

  // Confirm box: null | { type: "card", card } | { type: "set" }
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    // A new set: everything came from FC-02, nothing to look up
    if (isNew) {
      if (!state) {
        setStatus("notfound");
        return;
      }
      setSet({
        title: state.title,
        cardCount: state.cardCount,
        difficulty: state.difficulty,
        sourceFiles: state.fileNames,
        libraryId: state.libraryId,
        libraryName: state.libraryName,
        courseCode: state.courseCode,
      });
      setCards(mockFlashcardCards.slice(0, state.cardCount));
      setStatus("ready");
      return;
    }

    // A saved set: look it up (null when it doesn't exist or isn't this user's)
    setStatus("loading");
    try {
      const found = await getFlashcardSet(id, userId);
      if (!found) {
        setStatus("notfound");
        return;
      }
      setSet(found);
      setCards(mockFlashcardCards.slice(0, found.cardCount));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [id, isNew, state, userId]);

  useEffect(() => {
    load();
  }, [load]);

  // ---------- Page-level states ----------
  if (status === "loading") {
    return (
      <main className="lib-page">
        <p className="lib-message" role="status">Loading flashcards…</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="lib-page">
        <div className="lib-message" role="alert">
          <p>We couldn't load these flashcards.</p>
          <button type="button" className="secondary-button" onClick={load}>
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (status === "notfound") {
    return (
      <main className="lib-page">
        <div className="lib-message" role="alert">
          <p>This flashcard set doesn't exist, or you don't have access to it.</p>
          <Link to={ROUTES.myLibraries} className="primary-button">
            Back to My Libraries
          </Link>
        </div>
      </main>
    );
  }

  // ---------- Ready: the set ----------
  const libraryLink = set.libraryId ? ROUTES.library(set.libraryId) : ROUTES.myLibraries;

  // "15 cards · Hard · from lecture-3.pdf, summary.docx" (only the parts this set has)
  const details = [`${cards.length} ${cards.length === 1 ? "card" : "cards"}`];
  if (set.difficulty) details.push(capitalise(set.difficulty));
  if (set.sourceFiles) details.push(`from ${set.sourceFiles.join(", ")}`);

  function startEdit(card) {
    setEditingId(card.id);
    setDraft({ front: card.front, back: card.back });
    setDraftError("");
  }

  function handleDraftChange(event) {
    const { name, value } = event.target; // name is "front" or "back"
    setDraft((prev) => ({ ...prev, [name]: value }));
    setDraftError("");
  }

  function saveEdit(event) {
    event.preventDefault();
    const front = draft.front.trim();
    const back = draft.back.trim();
    if (!front || !back) {
      setDraftError("Both the question and the answer are needed.");
      return;
    }
    setCards(cards.map((card) => (card.id === editingId ? { ...card, front, back } : card)));
    setEditingId(null);
  }

  function cancelEdit() {
    // A card that was just added and never filled in is removed again
    setCards(cards.filter((card) => card.id !== editingId || card.front || card.back));
    setEditingId(null);
  }

  function addCard() {
    const card = { id: `new-${Date.now()}`, front: "", back: "" };
    setCards([...cards, card]);
    startEdit(card);
  }

  async function handleConfirm() {
    if (confirm.type === "card") {
      setCards(cards.filter((card) => card.id !== confirm.card.id));
      setConfirm(null);
      return;
    }
    // Delete the whole set, then go back to its library
    setDeleting(true);
    try {
      if (!isNew) await deleteFlashcardSet(id);
      navigate(libraryLink, { replace: true });
    } catch {
      setDeleting(false);
      setConfirm(null);
      setStatus("error");
    }
  }

  const dialog =
    confirm?.type === "card"
      ? { title: "Delete card?", message: `"${confirm.card.front}" will be removed from this set.`, label: "Delete card" }
      : { title: "Delete flashcard set?", message: `"${set.title}" and all of its cards will be permanently deleted.`, label: "Delete set" };

  return (
    <main className="lib-page">
      <Link to={libraryLink} className="det-back">
        ← Back to library
      </Link>

      <header className="det-header">
        <div>
          {set.libraryName && (
            <span className="lib-course">
              {set.courseCode} · {set.libraryName}
            </span>
          )}
          {isNew && <span className="fc-new-tag">New set</span>}
          <h1 className="det-title">{set.title}</h1>
          <p className="det-description">{details.join(" · ")}</p>
        </div>
        <div className="lib-header-actions det-header-actions">
          <button type="button" className="secondary-button det-danger" onClick={() => setConfirm({ type: "set" })}>
            Delete set
          </button>
          {cards.length > 0 && editingId === null ? (
            <Link to={ROUTES.study(id)} state={{ title: set.title, cards, libraryId: set.libraryId }} className="primary-button">
              Study these cards
            </Link>
          ) : (
            <button type="button" className="primary-button" disabled>
              Study these cards
            </button>
          )}
        </div>
      </header>

      {cards.length === 0 ? (
        <p className="det-empty">This set has no cards yet. Add one below.</p>
      ) : (
        <ol className="det-list">
          {cards.map((card, index) => (
            <li key={card.id} className="det-item fc-card-row">
              <span className="fc-card-number">{index + 1}</span>

              {editingId === card.id ? (
                <form className="fc-card-form" onSubmit={saveEdit}>
                  <label htmlFor={`front-${card.id}`}>Question</label>
                  <input id={`front-${card.id}`} name="front" value={draft.front} onChange={handleDraftChange} />
                  <label htmlFor={`back-${card.id}`}>Answer</label>
                  <textarea id={`back-${card.id}`} name="back" rows={3} value={draft.back} onChange={handleDraftChange} />
                  {draftError && (
                    <p className="error-message" role="alert">
                      {draftError}
                    </p>
                  )}
                  <div className="fc-card-actions">
                    <button type="submit" className="primary-button det-small">
                      Save
                    </button>
                    <button type="button" className="secondary-button det-small" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="fc-card-text">
                    <p className="fc-card-front">{card.front}</p>
                    <p className="fc-card-back">{card.back}</p>
                  </div>
                  <div className="fc-card-actions">
                    <button
                      type="button"
                      className="secondary-button det-small"
                      onClick={() => startEdit(card)}
                      disabled={editingId !== null}
                      aria-label={`Edit card ${index + 1}`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="secondary-button det-small det-danger"
                      onClick={() => setConfirm({ type: "card", card })}
                      disabled={editingId !== null}
                      aria-label={`Delete card ${index + 1}`}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ol>
      )}

      <button type="button" className="secondary-button fc-add-card" onClick={addCard} disabled={editingId !== null}>
        + Add card
      </button>

      {confirm && (
        <ConfirmDialog
          title={dialog.title}
          message={dialog.message}
          confirmLabel={dialog.label}
          busy={deleting}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </main>
  );
}

/* "Delete …?" confirmation box, the same as the library page's */
function ConfirmDialog({ title, message, confirmLabel, busy, onConfirm, onCancel }) {
  return (
    <div className="det-overlay" onClick={onCancel}>
      <div
        className="det-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="fc-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="fc-dialog-title">{title}</h2>
        <p>{message}</p>
        <div className="det-dialog-actions">
          <button type="button" className="secondary-button" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="primary-button det-danger-fill" onClick={onConfirm} disabled={busy}>
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
