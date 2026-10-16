import API_BASE_URL from "../api";
import { useState, useEffect } from "react";

const API_URL = `${API_BASE_URL}/api/goals`;

const formatMoney = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [addingToGoal, setAddingToGoal] = useState(null);
  const [additionalAmount, setAdditionalAmount] = useState("");
  const [loading, setLoading] = useState(true);

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
        `You only need ${formatMoney(
          goal.target - goal.saved
        )} more for this goal.`
      );
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${goalId}/add-money`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

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
    (total, goal) => total + goal.target,
    0
  );

  const totalSaved = goals.reduce(
    (total, goal) => total + goal.saved,
    0
  );

  const overallProgress =
    totalTarget === 0
      ? 0
      : Math.min(Math.round((totalSaved / totalTarget) * 100), 100);

  return (
    <main className="dashboard savings-page">
      <header className="savings-page-header">
        <div>
          <span className="section-label">YOUR FINANCIAL FUTURE</span>
          <h1>Savings Goals</h1>
          <p>
            Give your money a purpose. Set goals, build your savings,
            and celebrate every milestone.
          </p>
        </div>

        <div className="savings-header-badge">
          <span className="savings-badge-icon">₹</span>
          <div>
            <strong>{goals.length}</strong>
            <span>Active {goals.length === 1 ? "goal" : "goals"}</span>
          </div>
        </div>
      </header>

      <section className="savings-panel savings-create-panel">
        <div className="savings-section-heading">
          <div className="savings-heading-icon">+</div>
          <div>
            <span className="section-label">START PLANNING</span>
            <h2>Create a Savings Goal</h2>
            <p>Choose something you want to save for.</p>
          </div>
        </div>

        <form
          className="savings-create-form"
          onSubmit={(event) => {
            event.preventDefault();
            addGoal();
          }}
        >
          <div className="input-group">
            <label htmlFor="goal-name">Goal name</label>
            <input
              id="goal-name"
              type="text"
              placeholder="e.g. Emergency Fund"
              value={goalName}
              onChange={(event) => setGoalName(event.target.value)}
              maxLength={80}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="goal-target">Target amount</label>
            <div className="input-wrapper">
              <span>₹</span>
              <input
                id="goal-target"
                type="number"
                min="1"
                step="0.01"
                placeholder="50000"
                value={targetAmount}
                onChange={(event) => setTargetAmount(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="goal-saved">Already saved</label>
            <div className="input-wrapper">
              <span>₹</span>
              <input
                id="goal-saved"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={savedAmount}
                onChange={(event) => setSavedAmount(event.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="primary-button savings-submit">
            <span>+</span> Create Goal
          </button>
        </form>

        <p className="savings-form-note">
          Tip: Start with a realistic target and build your savings gradually.
        </p>
      </section>

      <section className="savings-overview">
        <div className="savings-overview-heading">
          <div>
            <span className="section-label">THE BIG PICTURE</span>
            <h2>Your Savings Overview</h2>
          </div>

          <div className="savings-overall-progress">
            <strong>{overallProgress}%</strong>
            <span>Overall progress</span>
          </div>
        </div>

        <div className="savings-summary-grid">
          <article className="savings-summary-card">
            <span className="savings-summary-icon saved-icon">↗</span>
            <span className="savings-summary-label">Total saved</span>
            <strong>{formatMoney(totalSaved)}</strong>
            <p>Money you've set aside</p>
          </article>

          <article className="savings-summary-card">
            <span className="savings-summary-icon target-icon">◎</span>
            <span className="savings-summary-label">Total target</span>
            <strong>{formatMoney(totalTarget)}</strong>
            <p>Your combined savings targets</p>
          </article>

          <article className="savings-summary-card">
            <span className="savings-summary-icon goals-icon">✦</span>
            <span className="savings-summary-label">Savings goals</span>
            <strong>{goals.length}</strong>
            <p>Goals you're working toward</p>
          </article>
        </div>

        <div
          className="savings-overall-track"
          role="progressbar"
          aria-label="Overall savings progress"
          aria-valuenow={overallProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div style={{ width: `${overallProgress}%` }} />
        </div>
      </section>

      <section className="savings-goals-section">
        <div className="savings-goals-heading">
          <div>
            <span className="section-label">ONE STEP AT A TIME</span>
            <h2>My Savings Goals</h2>
            <p>Every contribution brings you closer to what matters.</p>
          </div>
          <span className="savings-count">
            {goals.length} {goals.length === 1 ? "goal" : "goals"}
          </span>
        </div>

        {loading ? (
          <div className="savings-empty-state">
            <div className="savings-empty-icon">↻</div>
            <h3>Loading your goals</h3>
            <p>Your savings information is on its way.</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="savings-empty-state">
            <div className="savings-empty-icon">₹</div>
            <h3>Your next milestone starts here</h3>
            <p>
              You haven't created a savings goal yet. Add one above to
              start tracking your progress.
            </p>
          </div>
        ) : (
          <div className="savings-goals-grid">
            {goals.map((goal) => {
              const percentage =
                goal.target > 0
                  ? Math.min(
                      Math.round((goal.saved / goal.target) * 100),
                      100
                    )
                  : 0;

              const remaining = Math.max(goal.target - goal.saved, 0);
              const isCompleted = percentage === 100;
              const isAddingMoney = addingToGoal === goal.id;

              return (
                <article className="savings-goal-card" key={goal.id}>
                  <div className="savings-goal-topline">
                    <span className="savings-goal-symbol">₹</span>
                    <span
                      className={
                        isCompleted
                          ? "savings-status completed"
                          : "savings-status in-progress"
                      }
                    >
                      {isCompleted ? "✓ Completed" : "In progress"}
                    </span>
                  </div>

                  <div className="savings-goal-title-row">
                    <h3>{goal.name}</h3>
                    <strong className="savings-goal-percentage">
                      {percentage}%
                    </strong>
                  </div>

                  <p className="savings-goal-amounts">
                    <strong>{formatMoney(goal.saved)}</strong>
                    <span> of {formatMoney(goal.target)}</span>
                  </p>

                  <div
                    className="savings-goal-track"
                    role="progressbar"
                    aria-label={`${goal.name} progress`}
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div style={{ width: `${percentage}%` }} />
                  </div>

                  <div className="savings-goal-remaining">
                    <span>
                      {isCompleted ? "Target reached" : "Still to save"}
                    </span>
                    <strong>
                      {isCompleted ? "Well done!" : formatMoney(remaining)}
                    </strong>
                  </div>

                  {!isCompleted && (
                    <div className="savings-goal-actions">
                      {isAddingMoney ? (
                        <form
                          className="savings-add-money-form"
                          onSubmit={(event) => {
                            event.preventDefault();
                            addMoneyToGoal(goal.id);
                          }}
                        >
                          <label htmlFor={`add-money-${goal.id}`}>
                            Amount to add
                          </label>

                          <div className="input-wrapper">
                            <span>₹</span>
                            <input
                              id={`add-money-${goal.id}`}
                              type="number"
                              min="0.01"
                              step="0.01"
                              max={remaining}
                              placeholder="1000"
                              value={additionalAmount}
                              onChange={(event) =>
                                setAdditionalAmount(event.target.value)
                              }
                              required
                            />
                          </div>

                          <div className="savings-action-row">
                            <button
                              type="submit"
                              className="primary-button"
                            >
                              Save Money
                            </button>

                            <button
                              type="button"
                              className="savings-cancel-button"
                              onClick={() => {
                                setAddingToGoal(null);
                                setAdditionalAmount("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          type="button"
                          className="primary-button savings-add-button"
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

                  <div className="savings-goal-bottom">
                    <span>
                      {isCompleted
                        ? "You've reached your goal!"
                        : "Keep up the great progress"}
                    </span>

                    <button
                      type="button"
                      className="savings-delete-button"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default SavingsGoals;
