// ADM-01
import { Link } from "react-router-dom";
import {
  Users,
  Headphones,
  Megaphone,
  UserCheck,
  User,
} from "lucide-react";

function AdminDashboard() {
  //Temporary data before connecting to a database
  const pendingEducatorRequests = 3;
  const newSupportTickets = 5;
  //Retrieve the currently logged-in admin information
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
    );

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
            <p className="welcome-text">Welcome back,</p>
            <h1>{currentUser.name}</h1>
            <p>Manage users, support tickets, and advertisements.</p>
        </div>

        <Link to="/profile" className="profile-link">
            <User size={18} />
            View Profile
        </Link>
        </section>

      <section className="admin-statistics">
        <div className="admin-stat-card">
          <UserCheck size={32} />
          <h2>Pending Educator Requests</h2>
          <p>{pendingEducatorRequests}</p>
        </div>

        <div className="admin-stat-card">
          <Headphones size={32} />
          <h2>New Support Tickets</h2>
          <p>{newSupportTickets}</p>
        </div>
      </section>

      <section className="admin-actions">
        <Link to="/admin/users" className="admin-action-card">
          <Users size={36} />
          <h2>User Management</h2>
          <p>Review and manage user accounts.</p>
        </Link>

        <Link to="/admin/tickets" className="admin-action-card">
          <Headphones size={36} />
          <h2>Support Tickets</h2>
          <p>Review submitted problem reports.</p>
        </Link>

        <Link
          to="/admin/advertisements"
          className="admin-action-card"
        >
          <Megaphone size={36} />
          <h2>Advertisements</h2>
          <p>Manage advertisements shown to users.</p>
        </Link>
      </section>
    </main>
  );
}

export default AdminDashboard;