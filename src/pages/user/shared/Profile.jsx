// SHR-02

import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  //Retrieve the currently logged-in user's information from localStorage.
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  //Select the correct dashboard according to the user's role
  const dashboardPath =
    currentUser.role === "admin"
      ? "/admin-dashboard"
      : "/dashboard";

  //Stores the user's score history (currently empty).
  const results = [];

  //Log out the user by removing their session data and redirecting to login.
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <main className="profile-page">
      <section className="profile-card">
        <h1>My Profile</h1>

        <div className="profile-avatar">
          {currentUser.name.charAt(0).toUpperCase()}
        </div>

        <div className="profile-information">
          <p>
            <strong>Name:</strong> {currentUser.name}
          </p>

          <p>
            <strong>Email:</strong> {currentUser.email}
          </p>

          <p>
            <strong>Role:</strong> {currentUser.role}
          </p>

          <p>
            <strong>Email Status:</strong>{" "}
            {currentUser.isVerified ? "Verified" : "Not Verified"}
          </p>
        </div>

        {currentUser.role === "student" && (
          <div className="profile-points">
            <h2>Total Points</h2>
            <p>{currentUser.points || 0}</p>
          </div>
        )}

        {currentUser.role === "educator" && (
          <div className="profile-points">
            <h2>Account Type</h2>
            <p>Educator Account</p>
          </div>
        )}

        {currentUser.role === "admin" && (
          <div className="profile-points">
            <h2>Account Type</h2>
            <p>Administrator Account</p>
          </div>
        )}

        {currentUser.role === "student" && (
          <section className="score-history">
            <h2>Score History</h2>

            {results.length === 0 ? (
              <p>No results have been recorded yet.</p>
            ) : (
              <ul>
                {results.map((result) => (
                  <li key={result.id}>{result.score}</li>
                ))}
              </ul>
            )}
          </section>
        )}

        <div className="profile-actions">
          <Link to={dashboardPath} className="secondary-button">
            Back to Dashboard
          </Link>

          <button type="button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </section>
    </main>
  );
}

export default Profile;