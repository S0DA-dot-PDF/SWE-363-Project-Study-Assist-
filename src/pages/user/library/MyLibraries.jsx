import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getLibrariesForUser } from "../../data";

// Placeholder routes: update when the router is finalised.
const ROUTES = {
  join: "/libraries/join",             // LIB-02
  create: "/libraries/create",            // LIB-03
  details: (id) => `/libraries/${id}`, // LIB-04
};

const FILTERS = [
  { value: "all", label: "All" },
  { value: "mine", label: "Mine" },
  { value: "joined", label: "Joined" },
];

// userId is a prop for now; later it can come from getCurrentUser() / auth context.
export default function MyLibraries() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id ?? 1;
  const isEducator = currentUser?.role === "educator";
  const [libraries, setLibraries] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const load = async () => {
    setStatus("loading");
    try {
      setLibraries(await getLibrariesForUser(userId));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return libraries.filter((lib) => {
      if (isEducator && !lib.isOwner) return false;
      if (filter === "mine" && !lib.isOwner) return false;
      if (filter === "joined" && lib.isOwner) return false;
      return (
        !q ||
        lib.name.toLowerCase().includes(q) ||
        lib.courseCode.toLowerCase().includes(q)
      );
    });
  }, [libraries, filter, query, isEducator]);

  return (
    <main className="lib-page">
      <header className="lib-header">
        <h1>My Libraries</h1>
        <div className="lib-header-actions">
        {!isEducator && (
            <Link to={ROUTES.join} className="secondary-button">
            Join Library
            </Link>
        )}

        <Link to={ROUTES.create} className="primary-button">
            Create Library
        </Link>
        </div>
      </header>

      {status === "loading" && (
        <p className="lib-message" role="status">
          Loading your libraries…
        </p>
      )}

      {status === "error" && (
        <div className="lib-message" role="alert">
          <p>We couldn't load your libraries.</p>
          <button type="button" className="secondary-button" onClick={load}>
            Try again
          </button>
        </div>
      )}

      {/* Empty: user has no libraries at all */}
      {status === "ready" && libraries.filter((lib) => !isEducator || lib.isOwner).length === 0 && (
        <section className="lib-empty">
          <h2>You don't have any libraries yet</h2>
          <p>
            {isEducator
                ? "Create a library to start sharing materials with your students."
                : "Join a library with a code from your educator, or create your own."}
          </p>
          <div className="lib-header-actions">
            {!isEducator && (
            <Link to={ROUTES.join} className="secondary-button">
                Join Library
            </Link>
            )}
            <Link to={ROUTES.create} className="primary-button">
              Create Library
            </Link>
          </div>
        </section>
      )}

      {status === "ready" && libraries.length > 0 && (
        <>
          <div className="lib-toolbar">
            
            {!isEducator && (
            <div className="lib-filters" role="group" aria-label="Filter libraries">
                {FILTERS.map((f) => (
                <button
                    key={f.value}
                    type="button"
                    className={`lib-chip ${filter === f.value ? "is-active" : ""}`}
                    aria-pressed={filter === f.value}
                    onClick={() => setFilter(f.value)}
                >
                    {f.label}
                </button>
                ))}
            </div>
            )}
            <input
              type="search"
              className="lib-search"
              placeholder="Search by name or course code"
              aria-label="Search libraries"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {visible.length === 0 ? (
            <p className="lib-message">No libraries match your search.</p>
          ) : (
            <ul className="lib-grid">
              {visible.map((lib) => (
                <li key={lib.id}>
                  <Link to={ROUTES.details(lib.id)} className="lib-card">
                    <div className="lib-card-top">
                      <span className="lib-course">{lib.courseCode}</span>
                      <span
                        className={`lib-tag ${
                          lib.isOwner ? "lib-tag-mine" : "lib-tag-joined"
                        }`}
                      >
                        {lib.isOwner ? "Mine" : "Joined"}
                      </span>
                    </div>
                    <h2 className="lib-card-name">{lib.name}</h2>
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