// SHR-04
import { useState } from "react";
import { Link } from "react-router-dom";

function ReportProblem() {
  //Store the values entered by the user
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [ticketId, setTicketId] = useState("");

  //Handle report submission
  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    //Check that the required fields are completed
    if (
      category.trim() === "" ||
      subject.trim() === "" ||
      description.trim() === ""
    ) {
      setError("Please complete all required fields.");
      return;
    }

    //Validate the optional attachment
    if (attachment) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
      ];

      const maximumFileSize = 5 * 1024 * 1024;

      if (
        !allowedTypes.includes(attachment.type) ||
        attachment.size > maximumFileSize
      ) {
        setError(
          "Upload a JPG, PNG, or PDF file smaller than 5 MB."
        );
        return;
      }
    }

    //Create a temporary ticket ID before connecting to a database
    const generatedTicketId = `TICKET-${Date.now()}`;

    setTicketId(generatedTicketId);
    setSuccess(
      "Your report has been submitted successfully."
    );

    //Clear the form after successful submission
    setCategory("");
    setSubject("");
    setDescription("");
    setAttachment(null);
    event.target.reset();
  };

  return (
    <main className="report-page">
      <section className="report-card">
        <div className="report-header">
          <div>
            <h1>Report a Problem</h1>
            <p>
              Tell us about a problem you experienced while using
              Study Assist.
            </p>
          </div>

          <Link to="/dashboard" className="secondary-button">
            Back to Dashboard
          </Link>
        </div>

        <form
          className="report-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="problem-category">
            Category
          </label>

          <select
            id="problem-category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            <option value="">Select a category</option>
            <option value="Technical Problem">
              Technical Problem
            </option>
            <option value="Account Problem">
              Account Problem
            </option>
            <option value="Content Problem">
              Content Problem
            </option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="problem-subject">
            Subject
          </label>

          <input
            id="problem-subject"
            type="text"
            placeholder="Enter the problem subject"
            value={subject}
            onChange={(event) =>
              setSubject(event.target.value)
            }
          />

          <label htmlFor="problem-description">
            Description
          </label>

          <textarea
            id="problem-description"
            placeholder="Describe the problem in detail..."
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />

          <label htmlFor="problem-attachment">
            Attach a screenshot
            <span className="optional-text">
              {" "}
              (optional)
            </span>
          </label>

          <input
            id="problem-attachment"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(event) =>
              setAttachment(event.target.files[0])
            }
          />

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {success && (
            <div className="success-message">
              <p>{success}</p>
              <p>
                Your ticket ID is:{" "}
                <strong>{ticketId}</strong>
              </p>
            </div>
          )}

          <button type="submit">
            Submit Report
          </button>
        </form>
      </section>
    </main>
  );
}

export default ReportProblem;