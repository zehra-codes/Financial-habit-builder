import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/goals";

function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [addingToGoal, setAddingToGoal] = useState(null);
  const [additionalAmount, setAdditionalAmount] = useState("");
  const [loading, setLoading] = useState(true);

  // Load savings goals from MongoDB
  async function fetchGoals() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load goals");
      }

      setGoals(
        data.goals.map((goal) => ({
          ...goal,
          id: goal._id,
          target: Number(goal.target),
          saved: Number(goal.saved),
        }))
      );
    } catch (error) {
      console.error("Error loading goals:", error);
      alert("Could not load goals. Please check the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  // Add a new savings goal
  async function addGoal() {
    const target = Number(targetAmount);
    const saved = Number(savedAmount || 0);

    if (!goalName.trim() || !targetAmount || target <= 0) {
      alert("Please enter a goal name and a valid target amount.");
      return;
    }

    if (saved < 0 || saved > target) {
      alert("Saved amount must be between ₹0 and the target amount.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: goalName.trim(),
          target,
          saved,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not add goal");
      }

      setGoals((previousGoals) => [
        ...previousGoals,
        {
          ...data.goal,
          id: data.goal._id,
          target: Number(data.goal.target),
          saved: Number(data.goal.saved),
        },
      ]);

      setGoalName("");
      setTargetAmount("");
      setSavedAmount("");
      alert("Savings goal added successfully!");
    } catch (error) {
      console.error("Error adding goal:", error);
      alert(error.message || "Could not add savings goal.");
    }
  }

  // Add money to an existing goal in MongoDB
  async function addMoneyToGoal(goalId) {
    const amount = Number(additionalAmount);
    const goal = goals.find((item) => item.id === goalId);

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!goal) {
      alert("Savings goal not found.");
      return;
    }

    if (goal.saved + amount > goal.target) {
      alert(
        `You only need ₹${(
          goal.target - goal.saved
        ).toLocaleString("en-IN")} more for this goal.`
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${goalId}/add-money`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not add money");
      }

      const updatedGoal = data.goal;

      setGoals((previousGoals) =>
        previousGoals.map((item) =>
          item.id === goalId
            ? {
                ...updatedGoal,
                id: updatedGoal._id,
                target: Number(updatedGoal.target),
                saved: Number(updatedGoal.saved),
              }
            : item
        )
      );

      setAdditionalAmount("");
      setAddingToGoal(null);
      alert("Money added successfully!");
    } catch (error) {
      console.error("Error adding money:", error);
      alert(error.message || "Could not update savings.");
    }
  }

  // Delete a goal from MongoDB
  async function deleteGoal(goalId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this savings goal?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${goalId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not delete goal");
      }

      setGoals((previousGoals) =>
        previousGoals.filter((goal) => goal.id !== goalId)
      );

      if (addingToGoal === goalId) {
        setAddingToGoal(null);
        setAdditionalAmount("");
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      alert(error.message || "Could not delete savings goal.");
    }
  }

  const totalTarget = goals.reduce(
    (total, goal) => total + Number(goal.target),
    0
  );

  const totalSaved = goals.reduce(
    (total, goal) => total + Number(goal.saved),
    0
  );

  const overallProgress =
    totalTarget === 0
      ? 0
      : Math.min(Math.round((totalSaved / totalTarget) * 100), 100);

  return (
    <main className="dashboard">
      {/* Add Savings Goal */}
      <section className="card">
        <div className="section-heading">
          <div>
            <span className="section-label">SAVINGS PLANNER</span>
            <h1>Savings Goals</h1>
            <p>Set and track your financial savings goals.</p>
          </div>
        </div>

        <div className="update-form">
          <div className="input-group">
            <label>Goal Name</label>
            <input
              type="text"
              placeholder="e.g. Emergency Fund"
              value={goalName}
              onChange={(event) => setGoalName(event.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Target Amount</label>
            <div className="input-wrapper">
              <span>₹</span>
              <input
                type="number"
                min="1"
                placeholder="50000"
                value={targetAmount}
                onChange={(event) => setTargetAmount(event.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Already Saved</label>
            <div className="input-wrapper">
              <span>₹</span>
              <input
                type="number"
                min="0"
                placeholder="15000"
                value={savedAmount}
                onChange={(event) => setSavedAmount(event.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={addGoal}
          >
            + Add Savings Goal
          </button>
        </div>
      </section>

      {/* Overall Savings Summary */}
      <section className="card">
        <div className="section-heading">
          <div>
            <span className="section-label">SAVINGS OVERVIEW</span>
            <h2>Overall Progress</h2>
            <p>Track your progress across all savings goals.</p>
          </div>
          <strong>{overallProgress}%</strong>
        </div>

        <div className="totals-section">
          <div className="total-box">
            <span>Total Saved</span>
            <strong>₹{totalSaved.toLocaleString("en-IN")}</strong>
          </div>

          <div className="total-box">
            <span>Total Target</span>
            <strong>₹{totalTarget.toLocaleString("en-IN")}</strong>
          </div>

          <div className="total-box">
            <span>Goals</span>
            <strong>{goals.length}</strong>
          </div>
        </div>
      </section>

      {/* Savings Goals */}
      <section className="card">
        <div className="section-heading">
          <div>
            <span className="section-label">YOUR GOALS</span>
            <h2>My Savings Goals</h2>
            <p>Track your progress toward each goal.</p>
          </div>
        </div>

        {loading ? (
          <p>Loading savings goals...</p>
        ) : goals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">₹</div>
            <h4>No savings goals yet</h4>
            <p>Add your first savings goal above.</p>
          </div>
        ) : (
          <div className="goals-grid">
            {goals.map((goal) => {
              const percentage =
                goal.target > 0
                  ? Math.min(
                      Math.round((goal.saved / goal.target) * 100),
                      100
                    )
                  : 0;

              const remaining = Math.max(
                goal.target - goal.saved,
                0
              );

              const isCompleted = percentage === 100;

              return (
                <div key={goal.id} className="goal-card">
                  <div className="goal-card-header">
                    <div>
                      <h2>{goal.name}</h2>
                      <p>
                        ₹{goal.saved.toLocaleString("en-IN")} saved of ₹
                        {goal.target.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <span className="goal-percentage">
                      {percentage}%
                    </span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="goal-footer">
                    {isCompleted ? (
                      <strong className="goal-completed">
                        ✓ Goal Completed
                      </strong>
                    ) : (
                      <span>
                        ₹{remaining.toLocaleString("en-IN")} remaining
                      </span>
                    )}
                  </div>

                  {!isCompleted && (
                    <div className="update-form">
                      {addingToGoal === goal.id ? (
                        <>
                          <div className="input-group">
                            <label>Add Money</label>
                            <div className="input-wrapper">
                              <span>₹</span>
                              <input
                                type="number"
                                min="1"
                                placeholder="1000"
                                value={additionalAmount}
                                onChange={(event) =>
                                  setAdditionalAmount(event.target.value)
                                }
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            className="primary-button"
                            onClick={() => addMoneyToGoal(goal.id)}
                          >
                            Add to Goal
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() => {
                              setAddingToGoal(null);
                              setAdditionalAmount("");
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="primary-button"
                          onClick={() => {
                            setAddingToGoal(goal.id);
                            setAdditionalAmount("");
                          }}
                        >
                          + Add Money
                        </button>
                      )}
                    </div>
                  )}

                  <div className="goal-footer">
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default SavingsGoals;