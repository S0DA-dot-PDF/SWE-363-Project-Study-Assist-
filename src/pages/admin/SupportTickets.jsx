import { useState } from "react";
import {useNavigate, Link} from "react-router-dom";
function SupportTickets() {
    const navigate = useNavigate();
  const [tickets, setTickets] = useState([{
    id: 1,
    user: "Student 1",
    subject: "Quiz does not open",
    status: "Open",
    message: "Email verification isn't working for me."
    },
    {
    id: 2,
    user: "Educator 1",
    subject: "Unable to publish quiz",
    status: "Open",
    message: "I have attached my materials, but the question-generation feature is not working."
    },
    ]);
function deleteTicket(ticketId) {
  const remainingTickets = tickets.filter(
    (ticket) => ticket.id !== ticketId
  );
  setTickets(remainingTickets);
}

function escalateTicket(ticketId) {
  setTickets(
    tickets.map((ticket) =>
      ticket.id === ticketId
        ? { ...ticket, status: "Escalated" }
        : ticket
    )
  );
}

  return (
    <main className="container py-5">
    <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h1>Support Tickets</h1>
            <p>Review and manage issues submitted by users.</p>
          </div>

          <Link to="/admin-dashboard" className="btn btn-outline-primary">
            Back to Admin Dashboard
          </Link>
        </div>
      {tickets.length === 0 && <p className="alert alert-info">
          No tickets need to be processed. </p>}
      {tickets.map((ticket) => (
        <div key={ticket.id} className="review-card">
        <h2 className="h5">{ticket.subject}</h2>
        <p>User: {ticket.user}</p>
        <p>Status: {ticket.status}</p>
         <p>Message: {ticket.message}</p>


          <button
            type="button"
            className="btn btn-primary"
            onClick={() => escalateTicket(ticket.id)}
            disabled={ticket.status === "Escalated"}
          >
            {ticket.status === "Escalated"
              ? "Sent to Developer"
              : "Send to Developer"}
          </button>

          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteTicket(ticket.id)}>
            Delete Ticket
          </button>
        </div>
      ))}
    </main>
  );
}

export default SupportTickets;