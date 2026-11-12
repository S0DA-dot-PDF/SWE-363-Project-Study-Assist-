//Importing Tools
import { Link } from "react-router-dom";

//start page component
function Landing() {
  return (
    <main className="landing-page">
      <section className="landing-card">
        <h1>Study Assist</h1>

        <h2>Learn, practice, and improve together</h2>

        <p>
          Study Assist helps students review materials, join educational
          libraries, and improve their learning experience.
        </p>

        <div className="landing-actions">
          <Link to="/login" className="primary-button">
            Log In
          </Link>

          <Link to="/signup" className="secondary-button">
            Sign Up
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Landing;