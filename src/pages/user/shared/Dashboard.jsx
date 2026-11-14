//SHR-01

import { Link } from "react-router-dom";
import {
  BookOpen,
  Library,
  Gamepad2,
  Plus,
  User,
  CircleAlert,
  MessageCircle,
  ClipboardList,
  BarChart3,
  Sparkles,
} from "lucide-react";

function Dashboard() {
  //Retrieve the currently logged-in user's information from localStorage
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  //Store the user's joined libraries (currently empty)
  const libraries = [];

  //Identify the user's role
  const isStudent = currentUser.role === "student";
  const isEducator = currentUser.role === "educator";

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="welcome-text">
            Welcome back,
          </p>

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

        <Link to="/create-library" className="dashboard-card">
          <Plus className="dashboard-icon" size={32} />
          <h2>Create Library</h2>
          <p>Create your own study library.</p>
        </Link>
        <Link to="/quizzes/create" className="dashboard-card">
          <ClipboardList className="dashboard-icon" size={32} />
          <h2>Create AI Quiz</h2>
          <p>Generate a quiz from your study materials.</p>
        </Link>
        {isStudent && (
          <>
            <Link to="/join-library" className="dashboard-card">
              <Library className="dashboard-icon" size={32} />
              <h2>Join Library</h2>
              <p>Explore and join a new library.</p>
            </Link>

            <Link to="/live-match" className="dashboard-card">
              <Gamepad2 className="dashboard-icon" size={32} />
              <h2>Join Live Match</h2>
              <p>Participate in an educational match.</p>
            </Link>
            
            <Link to="/ai-study-help" className="dashboard-card ai-study-card">
              <Sparkles className="dashboard-icon" size={32} />

              <h2>AI Study Help</h2>

              <p>
                Generate AI summaries for educational materials and explanations
                for incorrect answers.
              </p>
            </Link>
          </>
        )}

        {isEducator && (
          <>
            <Link to="/create-match" className="dashboard-card">
              <Gamepad2 className="dashboard-icon" size={32} />
              <h2>Create Live Match</h2>
              <p>Host an educational live match.</p>
            </Link>

          </>
        )}
      </section>

      <section className="dashboard-summary">
        {libraries.length === 0 ? (
          <div className="empty-dashboard">
            <h2>
              {isStudent
                ? "You do not have any libraries yet."
                : "You have not created any libraries yet."}
            </h2>

            <p>
              {isStudent
                ? "Join a library or create one to start learning."
                : "Create a library to start teaching students."}
            </p>

            <div className="dashboard-actions">
              {isStudent && (
                <Link to="/join-library" className="primary-button">
                  Join a Library
                </Link>
              )}

              <Link to="/create-library" className="secondary-button">
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

      {isStudent && (
        <section className="student-summary">
          <div className="summary-box">
            <h3>Total Points</h3>
            <p>{currentUser.points || 0}</p>
          </div>

          <div className="summary-box">
            <h3>Recent Scores</h3>
            <p>No scores yet</p>
          </div>

          <Link to="/comments" className="summary-box summary-link">
            <MessageCircle className="summary-icon" size={28} />
            <h3>Recent Comments</h3>
            <p>No comments yet</p>
          </Link>
        </section>
      )}

      {isEducator && (
        <section className="student-summary">
          <Link to="/quizzes/generated" className="summary-box summary-link">
            <ClipboardList className="summary-icon" size={28} />
            <h3>Recent Quizzes</h3>
            <p>No quizzes yet</p>
          </Link>

          <Link to="/comments" className="summary-box summary-link">
            <MessageCircle className="summary-icon" size={28} />
            <h3>New Comments</h3>
            <p>Review student questions</p>
          </Link>

          <Link to="/educator/analytics" className="summary-box summary-link">
            <BarChart3 className="summary-icon" size={28} />
            <h3>Quiz Analytics</h3>
            <p>View quiz performance</p>
          </Link>
        </section>
      )}

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