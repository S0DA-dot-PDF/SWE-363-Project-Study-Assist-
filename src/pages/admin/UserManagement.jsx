import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getUsers,
  changeUserRole,
  suspendUser,
  reactivateUser,
  deleteUser,
  reviewEducatorRequest,
} from "../data";

const roleOptions = ["student", "educator", "admin"];

const statusOf = (user) => {
  if (user.isSuspended) return "Suspended";

  if (
    user.educatorRequestStatus === "pending" ||
    (user.role === "educator" &&
      !user.isApproved &&
      user.educatorRequestStatus !== "rejected")
  ) {
    return "Pending Approval";
  }

  if (user.educatorRequestStatus === "rejected") return "Rejected";

  return "Active";
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [phase, setPhase] = useState("loading");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [action, setAction] = useState(null);
  const [newRole, setNewRole] = useState("student");
  const [reason, setReason] = useState("");
  const [deleteStep, setDeleteStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  })();

  const adminId = currentUser?.id;
  const isAdmin = currentUser?.role?.toLowerCase() === "admin";

  const load = useCallback(async () => {
    setPhase("loading");
    setError("");

    try {
      const result = await getUsers();
      setUsers(result);
      setPhase("ready");
    } catch {
      setPhase("error");
      setError("Could not load users. Please try again.");
    }
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const selected =
    users.find((u) => String(u.id) === String(selectedId)) || null;

  const visible = useMemo(
    () =>
      users.filter((u) => {
        const q = query.trim().toLowerCase();

        return (
          (!q ||
            [u.name, u.email, u.id].some((x) =>
              String(x ?? "").toLowerCase().includes(q)
            )) &&
          (roleFilter === "all" || u.role === roleFilter) &&
          (statusFilter === "all" || statusOf(u) === statusFilter)
        );
      }),
    [users, query, roleFilter, statusFilter]
  );

  const startAction = (type) => {
    setAction(type);
    setError("");
    setReason("");
    setDeleteStep(1);
    setNewRole(selected?.role || "student");
  };

  const close = () => {
    if (busy) return;

    setSelectedId(null);
    setAction(null);
    setError("");
  };

  const submit = async () => {
    if (!selected || !adminId || busy) return;

    if (String(selected.id) === String(adminId)) {
      setError("You cannot manage your own account.");
      return;
    }

    if (
      (action === "suspend" || action === "delete") &&
      !reason.trim()
    ) {
      setError("A reason is required.");
      return;
    }

    if (action === "delete" && deleteStep === 1) {
      setDeleteStep(2);
      setError("");
      return;
    }

    setBusy(true);
    setError("");

    try {
      // The data layer validates actor, last active admin and record version again.
      const version = selected.version ?? 1;

      if (action === "role") {
        await changeUserRole(adminId, selected.id, newRole, version);
      }

      if (action === "suspend") {
        await suspendUser(
          adminId,
          selected.id,
          reason.trim(),
          version
        );
      }

      if (action === "reactivate") {
        await reactivateUser(adminId, selected.id, version);
      }

      if (action === "delete") {
        await deleteUser(
          adminId,
          selected.id,
          reason.trim(),
          version
        );
      }

      if (action === "approve" || action === "reject") {
        await reviewEducatorRequest(
          adminId,
          selected.id,
          action,
          version
        );
      }

      const updated = await getUsers();
      setUsers(updated);

      setSelectedId(null);
      setAction(null);
      setSuccess("User account updated successfully.");
    } catch (err) {
      if (
        err.message === "STALE_RECORD" ||
        err.message === "NOT_FOUND"
      ) {
        setError(
          "This account was already changed by another admin. Refresh to see the latest information."
        );
      } else if (err.message === "LAST_ADMIN") {
        setError("At least one active Admin must remain.");
      } else if (err.message === "SELF_ACTION") {
        setError("You cannot manage your own account.");
      } else {
        setError(err.message || "Unable to update this user.");
      }
    } finally {
      setBusy(false);
    }
  };

  if (!isAdmin) {
    return (
      <main className="um-page">
        <h1>Access denied</h1>
        <p>Only administrators can manage users.</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </main>
    );
  }

  return (
    <main className="um-page">
      <Link className="um-back" to="/admin-dashboard">
        ← Admin Dashboard
      </Link>

      <header className="um-header">
        <div>
          <h1>User Management</h1>
          <p>Manage accounts and educator requests.</p>
        </div>

        <button className="um-secondary" onClick={load}>
          Refresh
        </button>
      </header>

      {success && (
        <p className="um-success" role="status">
          {success}
        </p>
      )}

      {phase === "loading" && (
        <p role="status">Loading users…</p>
      )}

      {phase === "error" && (
        <div role="alert">
          <p>{error}</p>
          <button onClick={load}>Try again</button>
        </div>
      )}

      {phase === "ready" && (
        <>
          <div className="um-stats">
            <div>
              <strong>{users.length}</strong>
              <span>Total Users</span>
            </div>

            <div>
              <strong>
                {
                  users.filter(
                    (u) => statusOf(u) === "Active"
                  ).length
                }
              </strong>
              <span>Active</span>
            </div>

            <div>
              <strong>
                {
                  users.filter(
                    (u) => statusOf(u) === "Pending Approval"
                  ).length
                }
              </strong>
              <span>Pending Requests</span>
            </div>
          </div>

          <section
            className="um-filters"
            aria-label="Search and filter users"
          >
            <input
              type="search"
              aria-label="Search by name, email or KFUPM ID"
              placeholder="Search name, email or KFUPM ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <select
              aria-label="Filter by role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All roles</option>

              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>

              {[
                "Active",
                "Suspended",
                "Pending Approval",
                "Rejected",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </section>

          {visible.length === 0 ? (
            <p className="um-empty">No users found.</p>
          ) : (
            <div className="um-table-wrap">
              <table className="um-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>KFUPM ID</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {visible.map((u) => (
                    <tr key={u.id}>
                      <td>
                        {u.name}
                        {String(u.id) === String(adminId) &&
                          " (You)"}
                      </td>

                      <td>{u.email}</td>
                      <td>{u.id || "—"}</td>
                      <td>{u.role}</td>

                      <td>
                        <span className="um-status">
                          {statusOf(u)}
                        </span>
                      </td>

                      <td>
                        <button
                          className="um-secondary"
                          onClick={() => {
                            setSelectedId(u.id);
                            setAction(null);
                            setError("");
                            setSuccess("");
                          }}
                        >
                          Open user
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {selected && (
        <div
          className="um-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <section
            className="um-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="um-dialog-title"
          >
            <div className="um-dialog-top">
              <h2 id="um-dialog-title">{selected.name}</h2>

              <button
                aria-label="Close dialog"
                className="um-close"
                onClick={close}
                disabled={busy}
              >
                ×
              </button>
            </div>

            <dl className="um-details">
              <dt>Email</dt>
              <dd>{selected.email}</dd>

              <dt>KFUPM ID</dt>
              <dd>{selected.id || "Not provided"}</dd>

              <dt>Role</dt>
              <dd>{selected.role}</dd>

              <dt>Status</dt>
              <dd>{statusOf(selected)}</dd>
            </dl>

            {String(selected.id) === String(adminId) ? (
              <p className="um-warning">
                You cannot act on your own account.
              </p>
            ) : !action ? (
              <div className="um-actions">
                <button onClick={() => startAction("role")}>
                  Change Role
                </button>

                {!selected.isSuspended && (
                  <button onClick={() => startAction("suspend")}>
                    Suspend
                  </button>
                )}

                {selected.isSuspended && (
                  <button onClick={() => startAction("reactivate")}>
                    Reactivate
                  </button>
                )}

                <button
                  className="um-danger"
                  onClick={() => startAction("delete")}
                >
                  Delete
                </button>

                {statusOf(selected) === "Pending Approval" && (
                  <>
                    <button onClick={() => startAction("approve")}>
                      Approve Educator
                    </button>

                    <button onClick={() => startAction("reject")}>
                      Reject Request
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="um-confirm">
                <h3>
                  {action === "role"
                    ? "Change user role?"
                    : action === "delete"
                    ? deleteStep === 2
                      ? "Final deletion confirmation"
                      : "Delete user?"
                    : action === "suspend"
                    ? "Suspend user?"
                    : action === "reactivate"
                    ? "Reactivate user?"
                    : action === "approve"
                    ? "Approve educator request?"
                    : "Reject educator request?"}
                </h3>

                <p>
                  {action === "delete"
                    ? "This permanently removes the account from the mock user list."
                    : action === "suspend"
                    ? "The user will be blocked from logging in until reactivated."
                    : action === "reactivate"
                    ? "The account will be active again."
                    : action === "role"
                    ? "This changes the account's permissions."
                    : action === "approve"
                    ? "This grants educator approval."
                    : "This rejects the educator request."}
                </p>

                {action === "role" && (
                  <label>
                    New role
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    >
                      {roleOptions.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                {(action === "suspend" ||
                  action === "delete") && (
                  <label>
                    Reason (required)
                    <textarea
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      disabled={deleteStep === 2}
                    />
                  </label>
                )}

                {action === "delete" && deleteStep === 2 && (
                  <p className="um-warning">
                    Are you absolutely sure? This is the second
                    and final confirmation.
                  </p>
                )}

                {error && (
                  <p className="um-error" role="alert">
                    {error}{" "}
                    {error.includes("Refresh") && (
                      <button
                        onClick={() => {
                          close();
                          load();
                        }}
                      >
                        Refresh
                      </button>
                    )}
                  </p>
                )}

                <div className="um-dialog-buttons">
                  <button
                    className="um-secondary"
                    disabled={busy}
                    onClick={() => {
                      setAction(null);
                      setError("");
                    }}
                  >
                    Back
                  </button>

                  <button
                    className={
                      action === "delete" ? "um-danger" : ""
                    }
                    disabled={busy}
                    onClick={submit}
                  >
                    {busy
                      ? "Saving…"
                      : action === "delete" && deleteStep === 1
                      ? "Continue to final confirmation"
                      : "Confirm"}
                  </button>
                </div>
              </div>
            )}

            {!action && (
              <div className="um-dialog-buttons">
                <button className="um-secondary" onClick={close}>
                  Close
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
