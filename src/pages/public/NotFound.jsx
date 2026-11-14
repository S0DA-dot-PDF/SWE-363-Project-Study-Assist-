//PUB-06
import { Link } from "react-router-dom";

function NotFound() {
  //Retrieve the currently logged-in user's information
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  //Select the correct destination according to the user's role
  let homePath = "/";

  if (currentUser) {
    homePath =
      currentUser.role === "admin"
        ? "/admin-dashboard"
        : "/dashboard";
  }

  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>
          Sorry, the page you are looking for does not exist.
        </p>

        <Link to={homePath} className="primary-button">
          {currentUser ? "Back to Dashboard" : "Back to Home"}
        </Link>
      </section>
    </main>
  );
}

export default NotFound;