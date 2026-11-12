//PUB-02
//Importing Tools
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockUsers } from "../data/mockUsers";

//Creating the component
function Login() {
  const navigate = useNavigate();

  //Storing user data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //Handling form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    //Checking for empty fields
    if (email.trim() === "" || password.trim() === "") {
      setError("Please enter your email and password.");
      return;
    }

    //Email verification
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!validEmail.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const user = mockUsers.find(
  (user) => user.email === email && user.password === password
);
    //Verifying login credentials
    if (!user) {
    setError("Incorrect email or password.");
    return;
    }

    if (user.isSuspended) {
    setError("Your account has been suspended. Contact support.");
    return;
    }

    if (!user.isVerified) {
    setError("Please verify your email before logging in.");
    return;
    }

    if (user.role === "educator" && !user.isApproved) {
    setError("Your educator account is waiting for approval.");
    return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    if (user.role === "student") {
    navigate("/dashboard");
    } else if (user.role === "educator") {
    navigate("/educator-dashboard");
    } else if (user.role === "admin") {
    navigate("/admin-dashboard");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p>Log in to continue to Study Assist</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Log In</button>
        </form>

        <Link to="/reset-password">Forgot password?</Link>

        <p>
          Do not have an account?{" "}
          <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;