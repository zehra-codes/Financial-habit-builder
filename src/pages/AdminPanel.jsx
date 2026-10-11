
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/feedback";

function AdminPanel() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Qunoot Zehra",
      email: "qunoot@example.com",
      status: "Active",
    },
    {
      id: 2,
      name: "Demo User",
      email: "demo@example.com",
      status: "Active",
    },
  ]);

  const [feedback, setFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Load feedback from MongoDB
  async function loadFeedback() {
    setFeedbackLoading(true);
    setFeedbackError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load feedback.");
      }

      const data = await response.json();

      setFeedback(
        data.map((item) => ({
          ...item,
          id: item._id,
        }))
      );
    } catch (error) {
      console.error("Feedback loading error:", error);
      setFeedbackError(
        "Could not load feedback. Check that the backend is running."
      );
    } finally {
      setFeedbackLoading(false);
    }
  }

  useEffect(() => {
    loadFeedback();
  }, []);

  // Demo user controls (local state only)
  function toggleUserStatus(id) {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );
  }

  function deleteUser(id) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this demo user?"
    );

    if (confirmed) {
      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== id)
      );
    }
  }

  // Save feedback status to MongoDB
  async function resolveFeedback(id) {
    setUpdatingId(id);
    setFeedbackError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Resolved",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update feedback."
        );
      }

      setFeedback((currentFeedback) =>
        currentFeedback.map((item) =>
          item.id === id
            ? { ...data, id: data._id }
            : item
        )
      );
    } catch (error) {
      console.error("Feedback update error:", error);
      setFeedbackError(
        error.message || "Could not update feedback."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const resolvedFeedback = feedback.filter(
    (item) => item.status === "Resolved"
  ).length;

  const openFeedback = feedback.filter(
    (item) => item.status === "Open"
  ).length;

  return (
    <main className="dashboard">
      {/* Header */}
      <section className="card">
        <div className="section-heading">
          <div>
            <span className="section-label">ADMINISTRATION</span>
            <h1>Admin Panel</h1>
            <p>
              Manage users, monitor platform activity and review
              feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="card">
        <div className="section-heading">
          <div>
            <span className="section-label">PLATFORM OVERVIEW</span>
            <h2>Platform Analytics</h2>
            <p>Monitor important platform activity.</p>
          </div>
        </div>

        <div className="totals-section">
          <div className="total-box">
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>

          <div className="total-box">
            <span>Active Users</span>
            <strong>{activeUsers}</strong>
          </div>

          <div className="total-box">
            <span>Open Feedback</span>
            <strong>{openFeedback}</strong>
          </div>

          <div className="total-box">
            <span>Resolved</span>
            <strong>{resolvedFeedback}</strong>
          </div>
        </div>
      </section>

      {/* Usage Analytics */}
      <section className="card">
        <div className="section-heading">
          <div>
            <span className="section-label">USAGE</span>
            <h2>Platform Usage</h2>
            <p>
              Overview of activity across the main financial
              features.
            </p>
          </div>
        </div>

        <div className="totals-section">
          <div className="total-box">
            <span>Income &amp; Expenses</span>
            <strong>Active</strong>
          </div>

          <div className="total-box">
            <span>Financial Habits</span>
            <strong>Active</strong>
          </div>

          <div className="total-box">
            <span>Savings Goals</span>
            <strong>Active</strong>
          </div>

          <div className="total-box">
            <span>Wealth Analytics</span>
            <strong>Active</strong>
          </div>
        </div>
      </section>

      {/* User Management */}
      <section className="card">
        <div className="section-heading">
          <div>
            <span className="section-label">USER MANAGEMENT</span>
            <h2>Users</h2>
            <p>Manage registered platform users.</p>
          </div>

          <span className="transaction-count">
            {users.length} user{users.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="transaction-list">
          {users.length === 0 ? (
            <div className="empty-state">
              <h4>No users available</h4>
              <p>There are no demo users to display.</p>
            </div>
          ) : (
            users.map((user) => (
              <div className="transaction-item" key={user.id}>
                <div className="transaction-info">
                  <div className="transaction-icon">U</div>

                  <div>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>

                <div className="transaction-right">
                  <strong>{user.status}</strong>

                  <div>
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.status === "Active"
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Feedback and Complaints */}
      <section className="card">
        <div className="section-heading">
          <div>
            <span className="section-label">
              FEEDBACK &amp; COMPLAINTS
            </span>
            <h2>User Feedback</h2>
            <p>
              Review and resolve user feedback and complaints.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={loadFeedback}
            disabled={feedbackLoading}
          >
            {feedbackLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {feedbackError && (
          <div className="empty-state" role="alert">
            <p>{feedbackError}</p>
          </div>
        )}

        {feedbackLoading ? (
          <div className="empty-state">
            <p>Loading feedback...</p>
          </div>
        ) : feedback.length === 0 ? (
          <div className="empty-state">
            <h4>No feedback available</h4>
            <p>
              User feedback and complaints will appear here when
              submitted.
            </p>
          </div>
        ) : (
          <div className="transaction-list">
            {feedback.map((item) => (
              <div className="transaction-item" key={item.id}>
                <div className="transaction-info">
                  <div className="transaction-icon">
                    {item.type === "Complaint" ? "!" : "F"}
                  </div>

                  <div>
                    <strong>{item.type}</strong>
                    <span>{item.message}</span>
                    {item.createdAt && (
                      <span>
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="transaction-right">
                  <strong>{item.status}</strong>

                  {item.status === "Open" && (
                    <button
                      type="button"
                      className="primary-button"
                      disabled={updatingId === item.id}
                      onClick={() => resolveFeedback(item.id)}
                    >
                      {updatingId === item.id
                        ? "Saving..."
                        : "Mark Resolved"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminPanel;
