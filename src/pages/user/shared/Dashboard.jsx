//SHR-01
import { Link } from "react-router-dom";
import {
  BookOpen,
  Library,
  Gamepad2,
  Plus,
  User,
  CircleAlert,
} from "lucide-react";

import { useEffect, useState } from "react";
import { getLibrariesForUser } from "../../data";

function Dashboard() {
    //Retrieve the currently logged-in user's information from localStorage
  const currentUser = JSON.parse(
  localStorage.getItem("currentUser")
);
//Store the user's joined libraries (currently empty)*******
  //const libraries = [];
  const [libraries, setLibraries] = useState([]);

useEffect(() => {
  async function loadLibraries() {
    try {
      const data = await getLibrariesForUser(currentUser.id);
      setLibraries(data);
    } catch (error) {
      console.error("Failed to load libraries:", error);
    }
  }

  if (currentUser?.id != null) {
    loadLibraries();
  }
}, [currentUser?.id]);


  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="welcome-text">Welcome back,</p>
          <h1>{currentUser.name}</h1>
        </div>

        <Link to="/profile" className="profile-link">
        <User size={18} />
        View Profile
        </Link>
      </section>

      <section className="dashboard-shortcuts">
        <Link to="/libraries" className="dashboard-card">
        <BookOpen className="dashboard-icon" size={32} />
        <h2>My Libraries</h2>
        <p>View your educational libraries.</p>
        </Link>

        <Link to="/libraries/join" className="dashboard-card">
        <Library className="dashboard-icon" size={32} />
        <h2>Join Library</h2>
        <p>Explore and join a new library.</p>
        </Link>

        <Link to="/live-match" className="dashboard-card">
        <Gamepad2 className="dashboard-icon" size={32} />
        <h2>Join Live Match</h2>
        <p>Participate in an educational match.</p>
        </Link>

        <Link to="/libraries/create" className="dashboard-card">
        <Plus className="dashboard-icon" size={32} />
        <h2>Create Library</h2>
        <p>Create your own study library.</p>
        </Link>

      </section>

      <section className="dashboard-summary">
        {libraries.length === 0 ? (
          <div className="empty-dashboard">
            <h2>You do not have any libraries yet.</h2>
            <p>Join a library or create one to start learning.</p>

            <div className="dashboard-actions">
              <Link to="/libraries/join" className="primary-button">
                Join a Library
              </Link>

              <Link to="/libraries/create" className="secondary-button">
                Create a Library
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <h2>Your Libraries</h2>
          </div>
        )}
      </section>

      <section className="student-summary">
        <div className="summary-box">
          <h3>Total Points</h3>
          <p>{currentUser.points}</p>
        </div>

        <div className="summary-box">
          <h3>Recent Scores</h3>
          <p>No scores yet</p>
        </div>

        <div className="summary-box">
          <h3>Recent Comments</h3>
          <p>No comments yet</p>
        </div>
      </section>

      <div className="report-problem-container">
        <Link to="/report-problem" className="report-problem-button">
        <CircleAlert size={18} />
        Report a Problem
        </Link>
      </div>
    </main>
  );
}

export default Dashboard;