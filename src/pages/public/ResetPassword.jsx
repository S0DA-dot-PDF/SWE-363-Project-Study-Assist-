//PUB-05
import { mockUsers } from "../data/mockUsers";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  //Store the email and new password information
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //Control the current step and form messages
  const [step, setStep] = useState("email");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  //validate the email and check if the user exists
  const handleSendLink = (event) => {
  event.preventDefault();

  setError("");
  setSuccess("");

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!validEmail.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  const userExists = mockUsers.some(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (!userExists) {
    setError("No account was found with this email address.");
    return;
  }

  //move to the new password step
  setStep("password");
};

//Validate and save the new password
  const handleSavePassword = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

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

    setSuccess("Your password has been changed successfully.");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <main className="reset-page">
      <section className="reset-card">
        {step === "email" && (
          <>
            <h1>Reset Password</h1>

            <p>
              Enter your email address and we will send you a password reset
              link.
            </p>

            <form onSubmit={handleSendLink}>
              <label htmlFor="reset-email">Email</label>

              <input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}

              <button type="submit">Continue</button>
            </form>
          </>
        )}

        {step === "password" && (
          <>
            <h1>Create New Password</h1>

            <p>Enter and confirm your new password.</p>

            <form onSubmit={handleSavePassword}>
              <label htmlFor="new-password">New Password</label>

              <input
                id="new-password"
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <label htmlFor="confirm-new-password">
                Confirm New Password
              </label>

              <input
                id="confirm-new-password"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />

              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}

              <button type="submit">Save New Password</button>
            </form>
          </>
        )}

        <Link to="/login">Back to Log In</Link>
      </section>
    </main>
  );
}

export default ResetPassword;