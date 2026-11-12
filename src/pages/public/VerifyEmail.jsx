//PUB-04
//Importing Tools
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  //Get the email passed from the previous page
  const email = location.state?.email || "your email address";

  const [message, setMessage] = useState(
    "A verification link has been sent to your email."
  );

  //Resend the verification link
  const handleResend = () => {
    setMessage(`A new verification link has been sent to ${email}.`);
  };

  //Navigate to the login page
  const handleVerify = () => {
    navigate("/login");
  };

  return (
    <main className="verify-page">
      <section className="verify-card">
        <h1>Verify Your Email</h1>

        <p>
          Please check your email and click the verification link to activate
          your account.
        </p>

        <p className="email-text">{email}</p>

        {message && <p className="success-message">{message}</p>}

        <button type="button" onClick={handleResend}>
          Resend Link
        </button>

        <button type="button" onClick={handleVerify}>
          I Verified My Email
        </button>

        <Link to="/login">Back to Log In</Link>
      </section>
    </main>
  );
}

export default VerifyEmail;