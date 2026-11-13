// SHR-03
import { useState } from "react";
import { Link } from "react-router-dom";

function Comments() {
     //Get the currently logged-in user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  //Experimental data prior to database connection
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Student One",
      text: "I do not understand this question.",
      quiz: "Networking Quiz",
      question: "Question 1",
      isResolved: false,
      reply: "",
    },
  ]);

  //Store form inputs and filter selection
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [newComment, setNewComment] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  //Store the educator's reply for each comment
  const [replyText, setReplyText] = useState({});

  //Handle submitting a new student comment
  const handlePostComment = (event) => {
    event.preventDefault();
    setError("");

    if (!selectedQuiz || !selectedQuestion || newComment.trim() === "") {
      setError("Please select a quiz, select a question, and write a comment.");
      return;
    }

    //Create a new comment using the current user's information
    const comment = {
      id: Date.now(),
      author: currentUser.name,
      text: newComment,
      quiz: selectedQuiz,
      question: selectedQuestion,
      isResolved: false,
      reply: "",
    };

    //Create a new comment using the current user's information
    setComments([...comments, comment]);

    //Clear the form after successful submission
    setSelectedQuiz("");
    setSelectedQuestion("");
    setNewComment("");
  };

  //Submit the educator's reply to the student
const handleReply = (commentId) => {
    const reply = replyText[commentId]?.trim();

    //Prevent submitting an empty reply
    if (!reply) {
        return;
    }

    //Update the reply of the selected comment
    setComments(
        comments.map((comment) =>
        comment.id === commentId
            ? {
                ...comment,
                reply: reply,
            }
            : comment
        )
    );

    setReplyText({
        ...replyText,
        [commentId]: "",
    });
    };

    //Mark a comment as resolved
  const handleMarkResolved = (commentId) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, isResolved: true }
          : comment
      )
    );
  };

  //Flag a comment for review
  const handleFlag = () => {
    alert("Comment flagged for review.");
  };

  //Filter comments based on their status
  const filteredComments = comments.filter((comment) => {
    if (filter === "unanswered") {
      return !comment.reply;
    }

    if (filter === "resolved") {
      return comment.isResolved;
    }

    return true;
  });

  return (
    <main className="comments-page">
      <section className="comments-card">
        <div className="comments-header">
          <div>
            <h1>Comments</h1>
            <p>
            {currentUser.role === "student"
                ? "Ask questions about quizzes and games."
                : "Review student questions and provide helpful replies."}
            </p>
          </div>

          <Link to="/dashboard" className="secondary-button">
            Back to Dashboard
          </Link>
        </div>

        {currentUser.role === "student" && (
          <form className="comment-form" onSubmit={handlePostComment}>
            <label htmlFor="quiz-select">Choose a quiz or game</label>

            <select
              id="quiz-select"
              value={selectedQuiz}
              onChange={(event) => setSelectedQuiz(event.target.value)}
            >
              <option value="">Select a quiz or game</option>
              <option value="Networking Quiz">Networking Quiz</option>
              <option value="Database Quiz">Database Quiz</option>
              <option value="Live Educational Game">
                Live Educational Game
              </option>
            </select>

            <label htmlFor="question-select">Choose a question</label>

            <select
              id="question-select"
              value={selectedQuestion}
              onChange={(event) => setSelectedQuestion(event.target.value)}
            >
              <option value="">Select a question</option>
              <option value="Question 1">Question 1</option>
              <option value="Question 2">Question 2</option>
              <option value="Question 3">Question 3</option>
              <option value="Free Question">Free Question</option>
            </select>

            <label htmlFor="new-comment">Write a comment</label>

            <textarea
              id="new-comment"
              placeholder="Write your question or comment..."
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
            />

            {error && <p className="error-message">{error}</p>}

            <button type="submit">Post Comment</button>
          </form>
        )}

        <div className="comments-filter">
          <label htmlFor="comment-filter">Filter comments</label>

          <select
            id="comment-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All Comments</option>
            <option value="unanswered">Unanswered</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <section className="comments-list">
          {filteredComments.length === 0 ? (
            <p className="empty-comments">No comments yet.</p>
          ) : (
            filteredComments.map((comment) => (
              <article className="comment-item" key={comment.id}>
                <div className="comment-item-header">
                  <strong>{comment.author}</strong>

                  <span
                    className={
                      comment.isResolved ? "resolved" : "unresolved"
                    }
                  >
                    {comment.isResolved ? "Resolved" : "Unresolved"}
                  </span>
                </div>

                <p className="comment-text">{comment.text}</p>

                <p className="comment-details">
                  {comment.quiz} — {comment.question}
                </p>

                {comment.reply && (
                  <div className="comment-reply">
                    <strong>Educator Reply:</strong>
                    <p>{comment.reply}</p>
                  </div>
                )}

                <div className="comment-actions">
                    {currentUser.role === "educator" && (
                        <>
                        {!comment.reply && (
                        <form
                            className="reply-form"
                            onSubmit={(event) => {
                            event.preventDefault();
                            handleReply(comment.id);
                            }}
                        >
                            <label htmlFor={`reply-${comment.id}`}>
                            Write a reply
                            </label>

                            <textarea
                            id={`reply-${comment.id}`}
                            placeholder="Write your reply to the student..."
                            value={replyText[comment.id] || ""}
                            onChange={(event) =>
                                setReplyText({
                                ...replyText,
                                [comment.id]: event.target.value,
                                })
                            }
                            />

                            <button type="submit">Reply</button>
                        </form>
                        )}

                        {!comment.isResolved && (
                            <button
                            type="button"
                            onClick={() => handleMarkResolved(comment.id)}
                            >
                            Mark Resolved
                            </button>
                        )}
                        </>
                    )}

                    {currentUser.role === "student" && (
                        <button type="button" onClick={handleFlag}>
                        Flag
                        </button>
                    )}
                </div>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}

export default Comments;