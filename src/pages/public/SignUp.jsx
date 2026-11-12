//PUB-03
//Importing Tools
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

//Store the values entered by the user
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEducator, setIsEducator] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    //Check if all required fields are filled
    if (
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      setError("Please complete all required fields.");
      return;
    }
    //Validate the email format
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!validEmail.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    //Check that the password contains at least 8 characters,
    //including at least one letter and one number
    const validPassword = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (!validPassword.test(password)) {
      setError(
        "Password must be at least 8 characters and contain a letter and a number."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSuccess(
      isEducator
        ? "Your educator request has been sent for approval."
        : "Account created successfully. Please verify your email."
    );

    //Redirect the user to the email verification page after 1.5 seconds
    setTimeout(() => {
      navigate("/verify-email");
    }, 1500);
  };

  return (
    <main className="signup-page">
      <section className="signup-card">
        <h1>Create Account</h1>
        <p>Join Study Assist and start learning.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isEducator}
              onChange={(event) => setIsEducator(event.target.checked)}
            />
            I am an educator
          </label>

          {error && <p className="error-message">{error}</p>}

          {success && <p className="success-message">{success}</p>}

          <button type="submit">Sign Up</button>
        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">Log In</Link>
        </p>
      </section>
    </main>
  );
}

export default SignUp;