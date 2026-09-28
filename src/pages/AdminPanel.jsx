import { useState } from "react";

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

  const [feedback, setFeedback] = useState([
    {
      id: 1,
      type: "Feedback",
      message: "The savings goal tracker is useful.",
      status: "Open",
    },
    {
      id: 2,
      type: "Complaint",
      message: "Monthly reports could be easier to read.",
      status: "Open",
    },
  ]);

  function toggleUserStatus(id) {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : user
      )
    );
  }

  function deleteUser(id) {
    setUsers(
      users.filter((user) => user.id !== id)
    );
  }

  function resolveFeedback(id) {
    setFeedback(
      feedback.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Resolved",
            }
          : item
      )
    );
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
            <span className="section-label">
              ADMINISTRATION
            </span>

            <h1>Admin Panel</h1>

            <p>
              Manage users, monitor platform activity
              and review feedback.
            </p>
          </div>

        </div>

      </section>

      {/* Platform Overview */}
      <section className="card">

        <div className="section-heading">

          <div>
            <span className="section-label">
              PLATFORM OVERVIEW
            </span>

            <h2>Platform Analytics</h2>

            <p>
              Monitor important platform activity.
            </p>
          </div>

        </div>

        <div className="totals-section">

          <div className="total-box">
            <span>Total Users</span>

            <strong>
              {users.length}
            </strong>
          </div>

          <div className="total-box">
            <span>Active Users</span>

            <strong>
              {activeUsers}
            </strong>
          </div>

          <div className="total-box">
            <span>Open Feedback</span>

            <strong>
              {openFeedback}
            </strong>
          </div>

          <div className="total-box">
            <span>Resolved</span>

            <strong>
              {resolvedFeedback}
            </strong>
          </div>

        </div>

      </section>

      {/* Usage Analytics */}
      <section className="card">

        <div className="section-heading">

          <div>
            <span className="section-label">
              USAGE
            </span>

            <h2>Platform Usage</h2>

            <p>
              Overview of activity across the main
              financial features.
            </p>
          </div>

        </div>

        <div className="totals-section">

          <div className="total-box">
            <span>Income & Expenses</span>
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
            <span className="section-label">
              USER MANAGEMENT
            </span>

            <h2>Users</h2>

            <p>
              Manage registered platform users.
            </p>
          </div>

          <span className="transaction-count">
            {users.length} user
            {users.length !== 1 ? "s" : ""}
          </span>

        </div>

        <div className="transaction-list">

          {users.map((user) => (

            <div
              className="transaction-item"
              key={user.id}
            >

              <div className="transaction-info">

                <div className="transaction-icon">
                  👤
                </div>

                <div>

                  <strong>
                    {user.name}
                  </strong>

                  <span>
                    {user.email}
                  </span>

                </div>

              </div>

              <div className="transaction-right">

                <strong>
                  {user.status}
                </strong>

                <div>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      toggleUserStatus(user.id)
                    }
                  >
                    {user.status === "Active"
                      ? "Deactivate"
                      : "Activate"}
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      deleteUser(user.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* Feedback & Complaints */}
      <section className="card">

        <div className="section-heading">

          <div>
            <span className="section-label">
              FEEDBACK & COMPLAINTS
            </span>

            <h2>User Feedback</h2>

            <p>
              Review and resolve user feedback and
              complaints.
            </p>
          </div>

        </div>

        {feedback.length === 0 ? (

          <div className="empty-state">

            <h4>No feedback available</h4>

            <p>
              User feedback and complaints will appear
              here.
            </p>

          </div>

        ) : (

          <div className="transaction-list">

            {feedback.map((item) => (

              <div
                className="transaction-item"
                key={item.id}
              >

                <div className="transaction-info">

                  <div className="transaction-icon">
                    {item.type === "Complaint"
                      ? "!"
                      : "✓"}
                  </div>

                  <div>

                    <strong>
                      {item.type}
                    </strong>

                    <span>
                      {item.message}
                    </span>

                  </div>

                </div>

                <div className="transaction-right">

                  <strong>
                    {item.status}
                  </strong>

                  {item.status === "Open" && (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() =>
                        resolveFeedback(item.id)
                      }
                    >
                      Mark Resolved
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