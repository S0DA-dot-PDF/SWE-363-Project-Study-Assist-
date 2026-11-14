import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getLibrary,
  getMaterials,
  getQuizzes,
  getFlashcardSets,
  getMembers,
  renameMaterial,
  replaceMaterial,
  deleteMaterial,
  updateLibrary,
  deleteLibrary,
  regenerateJoinCode,
} from "../../data";

// Placeholder routes: update when the router is finalised.
const ROUTES = {
  myLibraries: "/libraries",
  join: "/libraries/join",                          // LIB-02
  upload: (id) => `/libraries/${id}/upload`,        // LIB-05
  createMenu: (id) => `/libraries/${id}/create`,    // LIB-06
  quiz: (id) => `/quizzes/${id}`,                   // QZ-05
  flashcards: (id) => `/flashcards/${id}`,          // FC-03
  results: (id) => `/quizzes/${id}/results`,        // EDU-02
  summarise: (libraryId, materialId) => `/summaries?library=${libraryId}&material=${materialId}`, // STU-01
};

const EMPTY_TEXT = {
  materials: "No materials yet",
  quizzes: "No quizzes yet",
  flashcards: "No flashcards yet",
  members: "No members yet",
};

// Text shown in the confirmation dialog for each kind of action.
function confirmContent(confirm, library) {
  if (confirm.type === "material") {
    return {
      title: "Delete material?",
      message: `"${confirm.item.name}" will be permanently removed from this library.`,
      label: "Delete",
    };
  }
  if (confirm.type === "code") {
    return {
      title: "Regenerate joining code?",
      message: "The current code will stop working. Students who already joined stay in the library.",
      label: "Regenerate",
    };
  }
  return {
    title: "Delete library?",
    message: `"${library.name}" and all of its materials, quizzes and flashcards will be permanently deleted.`,
    label: "Delete library",
  };
}

function ConfirmDialog({ title, message, confirmLabel, busy, onConfirm, onCancel }) {
  // Escape closes the dialog (same as Cancel)
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="det-overlay" onClick={onCancel}>
      <div
        className="det-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="det-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="det-dialog-title">{title}</h2>
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

export default function LibraryDetails() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id ?? 1;
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const replaceTargetId = useRef(null);

  const [status, setStatus] = useState("loading"); // loading | error | notfound | ready
  const [library, setLibrary] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [members, setMembers] = useState([]);
  const [tab, setTab] = useState("materials");

  const [renaming, setRenaming] = useState(null); // { id, value } | null
  const [confirm, setConfirm] = useState(null); // { type: "material" | "code" | "library", item? } | null
  const [editForm, setEditForm] = useState(null); // form values, null = dialog closed
  const [editError, setEditError] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [copyState, setCopyState] = useState("idle"); // idle | code | link | failed

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const lib = await getLibrary(id, userId);
      if (!lib) {
        setStatus("notfound");
        return;
      }
      const [mats, qs, fcs, mems] = await Promise.all([
        getMaterials(lib.id),
        getQuizzes(lib.id),
        getFlashcardSets(lib.id),
        lib.isOwner ? getMembers(lib.id) : Promise.resolve([]),
      ]);
      setLibrary(lib);
      setMaterials(mats);
      setQuizzes(qs);
      setFlashcardSets(fcs);
      setMembers(mems);
      setTab("materials");
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [id, userId]);

  useEffect(() => {
    load();
  }, [load]);

  // ---------- Loading / error / not found ----------
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

  if (status === "notfound") {
    return (
      <main className="lib-page">
        <div className="lib-message">
          <p>This library doesn't exist, or you don't have access to it.</p>
          <Link to={ROUTES.myLibraries} className="primary-button">
            Back to My Libraries
          </Link>
        </div>
      </main>
    );
  }

  // ---------- Ready ----------
  // Assumption: the owner is the educator. Change this one line if roles work differently.
  const isOwner = library.isOwner;
  const isEducator = isOwner;

  const shareLink = `${window.location.origin}${ROUTES.join}?code=${encodeURIComponent(library.joinCode)}`;

  const refreshMaterials = async () => setMaterials(await getMaterials(library.id));

  const handleCopy = async (text, kind) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(kind);
    } catch {
      setCopyState("failed");
    }
    setTimeout(() => setCopyState("idle"), 2000);
  };

  // --- Rename material ---
  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    const value = renaming.value.trim();
    if (!value) {
      setActionError("Material name can't be empty.");
      return;
    }
    setActionError("");
    try {
      await renameMaterial(renaming.id, value);
      await refreshMaterials();
      setRenaming(null);
    } catch {
      setActionError("Couldn't rename the material. Please try again.");
    }
  };

  // --- Replace material (opens the file picker, then swaps the file) ---
  const startReplace = (materialId) => {
    replaceTargetId.current = materialId;
    fileInputRef.current.click();
  };

  const handleFileChosen = async (e) => {
    const file = e.target.files[0];
    e.target.value = ""; // lets the same file be picked again later
    if (!file || replaceTargetId.current === null) return;
    setActionError("");
    try {
      await replaceMaterial(replaceTargetId.current, file.name);
      await refreshMaterials();
    } catch {
      setActionError("Couldn't replace the file. Please try again.");
    }
  };

  // --- Confirmation dialog: delete material / regenerate code / delete library ---
  const handleConfirm = async () => {
    setBusy(true);
    setActionError("");
    try {
      if (confirm.type === "material") {
        await deleteMaterial(confirm.item.id);
        await refreshMaterials();
      } else if (confirm.type === "code") {
        const joinCode = await regenerateJoinCode(library.id);
        setLibrary((prev) => ({ ...prev, joinCode }));
      } else if (confirm.type === "library") {
        await deleteLibrary(library.id);
        navigate(ROUTES.myLibraries);
        return;
      }
      setConfirm(null);
    } catch {
      setActionError("Something went wrong. Please try again.");
      setConfirm(null);
    } finally {
      setBusy(false);
    }
  };

  // --- Edit library ---
  const openEdit = () => {
    setEditError("");
    setEditForm({
      name: library.name,
      courseCode: library.courseCode,
      description: library.description ?? "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setEditError("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.courseCode.trim()) {
      setEditError("Library name and course code are required.");
      return;
    }
    setBusy(true);
    setEditError("");
    try {
      const updated = await updateLibrary(library.id, userId, editForm);
      setLibrary((prev) => ({ ...prev, ...updated }));
      setEditForm(null);
    } catch (err) {
      setEditError(
        err.message === "DUPLICATE_NAME"
          ? "You already have a library with this name."
          : "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  // ---------- Tabs ----------
  const tabs = [
    { value: "materials", label: `Materials (${materials.length})` },
    { value: "quizzes", label: `Quizzes (${quizzes.length})` },
    { value: "flashcards", label: `Flashcards (${flashcardSets.length})` },
  ];
  if (isEducator) tabs.push({ value: "members", label: `Members (${members.length})` });

  const emptyHint = (
    <>
      {EMPTY_TEXT[tab]}
      {isOwner && tab !== "members" && (
        <>
          {" "}
          <Link to={tab === "materials" ? ROUTES.upload(library.id) : ROUTES.createMenu(library.id)}>
            {tab === "materials" ? "Upload one" : "Create one"}
          </Link>
        </>
      )}
    </>
  );

  return (
    <main className="lib-page">
      <Link to={ROUTES.myLibraries} className="det-back">
        ← My Libraries
      </Link>

      {/* Header */}
      <header className="det-header">
        <div>
          <span className="lib-course">{library.courseCode}</span>
          <h1 className="det-title">{library.name}</h1>
          {library.description && <p className="det-description">{library.description}</p>}
        </div>

        {isOwner && (
          <div className="lib-header-actions det-header-actions">
            <Link to={ROUTES.upload(library.id)} className="secondary-button">
              Upload
            </Link>
            <Link to={ROUTES.createMenu(library.id)} className="primary-button">
              Create
            </Link>
            <button type="button" className="secondary-button" onClick={openEdit}>
              Edit
            </button>
            <button
              type="button"
              className="secondary-button det-danger"
              onClick={() => setConfirm({ type: "library" })}
            >
              Delete
            </button>
          </div>
        )}
      </header>

      {/* Share (educator): code + link + regenerate */}
      {isEducator && (
        <section className="det-share" aria-label="Share this library">
          <div className="det-share-row">
            <span className="det-share-label">Joining code</span>
            <code className="det-code">{library.joinCode}</code>
            <button type="button" className="secondary-button det-small" onClick={() => handleCopy(library.joinCode, "code")}>
              {copyState === "code" ? "Copied!" : copyState === "failed" ? "Copy failed" : "Copy code"}
            </button>
            <button type="button" className="secondary-button det-small" onClick={() => handleCopy(shareLink, "link")}>
              {copyState === "link" ? "Copied!" : "Copy link"}
            </button>
            <button type="button" className="secondary-button det-small" onClick={() => setConfirm({ type: "code" })}>
              Regenerate
            </button>
          </div>
          <p className="det-share-link">{shareLink}</p>
        </section>
      )}

      {actionError && (
        <p className="error-message" role="alert">
          {actionError}
        </p>
      )}

      {/* Tabs */}
      <div className="det-tabs" role="tablist" aria-label="Library content">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={tab === t.value}
            className={`det-tab ${tab === t.value ? "is-active" : ""}`}
            onClick={() => setTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <section className="det-panel" role="tabpanel">
        {/* Materials */}
        {tab === "materials" &&
          (materials.length === 0 ? (
            <p className="det-empty">{emptyHint}</p>
          ) : (
            <ul className="det-list">
              {materials.map((m) => (
                <li key={m.id} className="det-item">
                  {renaming?.id === m.id ? (
                    <form className="det-rename" onSubmit={handleRenameSubmit}>
                      <input
                        type="text"
                        aria-label="Material name"
                        value={renaming.value}
                        onChange={(e) => setRenaming({ ...renaming, value: e.target.value })}
                        autoFocus
                      />
                      <button type="submit" className="primary-button det-small">
                        Save
                      </button>
                      <button type="button" className="secondary-button det-small" onClick={() => setRenaming(null)}>
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <div className="det-item-info">
                        <strong>{m.name}</strong>
                        <span>
                          {m.fileName} · {new Date(m.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="det-item-actions">
                        {isOwner ? (
                          <>
                            <button
                              type="button"
                              className="secondary-button det-small"
                              onClick={() => setRenaming({ id: m.id, value: m.name })}
                            >
                              Rename
                            </button>
                            <button type="button" className="secondary-button det-small" onClick={() => startReplace(m.id)}>
                              Replace
                            </button>
                            <button
                              type="button"
                              className="secondary-button det-small det-danger"
                              onClick={() => setConfirm({ type: "material", item: m })}
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <Link to={ROUTES.summarise(library.id, m.id)} className="primary-button det-small">
                            Summarise
                          </Link>
                        )}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ))}

        {/* Quizzes */}
        {tab === "quizzes" &&
          (quizzes.length === 0 ? (
            <p className="det-empty">{emptyHint}</p>
          ) : (
            <ul className="det-list">
              {quizzes.map((q) => (
                <li key={q.id} className="det-item">
                  <Link to={ROUTES.quiz(q.id)} className="det-item-link">
                    <strong>{q.title}</strong>
                    <span>{q.questionCount} questions</span>
                  </Link>
                  {isEducator && (
                    <Link to={ROUTES.results(q.id)} className="secondary-button det-small">
                      Results
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ))}

        {/* Flashcards */}
        {tab === "flashcards" &&
          (flashcardSets.length === 0 ? (
            <p className="det-empty">{emptyHint}</p>
          ) : (
            <ul className="det-list">
              {flashcardSets.map((f) => (
                <li key={f.id} className="det-item">
                  <Link to={ROUTES.flashcards(f.id)} className="det-item-link">
                    <strong>{f.title}</strong>
                    <span>{f.cardCount} cards</span>
                  </Link>
                </li>
              ))}
            </ul>
          ))}

        {/* Members (educator only) */}
        {tab === "members" &&
          (members.length === 0 ? (
            <p className="det-empty">{EMPTY_TEXT.members}. Share the joining code to invite students.</p>
          ) : (
            <ul className="det-list">
              {members.map((m) => (
                <li key={m.id} className="det-item">
                  <strong>{m.name}</strong>
                </li>
              ))}
            </ul>
          ))}
      </section>

      {/* Hidden file picker used by "Replace" */}
      <input ref={fileInputRef} type="file" hidden onChange={handleFileChosen} />

      {/* Delete / regenerate confirmation */}
      {confirm && (
        <ConfirmDialog
          title={confirmContent(confirm, library).title}
          message={confirmContent(confirm, library).message}
          confirmLabel={confirmContent(confirm, library).label}
          busy={busy}
          onConfirm={handleConfirm}
          onCancel={() => !busy && setConfirm(null)}
        />
      )}

      {/* Edit library dialog */}
      {editForm && (
        <div className="det-overlay" onClick={() => !busy && setEditForm(null)}>
          <div
            className="det-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="det-edit-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="det-edit-title">Edit library</h2>
            <form className="det-edit-form" onSubmit={handleEditSubmit} noValidate>
              <label htmlFor="edit-name">Library name</label>
              <input id="edit-name" name="name" type="text" value={editForm.name} onChange={handleEditChange} />

              <label htmlFor="edit-course">Course code</label>
              <input id="edit-course" name="courseCode" type="text" value={editForm.courseCode} onChange={handleEditChange} />

              <label htmlFor="edit-description">Description (optional)</label>
              <textarea
                id="edit-description"
                name="description"
                rows={3}
                value={editForm.description}
                onChange={handleEditChange}
              />

              {editError && (
                <p className="error-message" role="alert">
                  {editError}
                </p>
              )}

              <div className="det-dialog-actions">
                <button type="button" className="secondary-button" onClick={() => setEditForm(null)} disabled={busy}>
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={busy}>
                  {busy ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}