import { useState } from "react";

function SavingsGoals() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Emergency Fund",
      target: 50000,
      saved: 15000,
    },
  ]);

  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");

  const [addingToGoal, setAddingToGoal] = useState(null);
  const [additionalAmount, setAdditionalAmount] = useState("");

  function addGoal() {
    const target = Number(targetAmount);
    const saved = Number(savedAmount);

    if (!goalName.trim() || target <= 0 || saved < 0) {
      alert("Please enter valid goal details.");
      return;
    }

    if (saved > target) {
      alert("Saved amount cannot be greater than the target amount.");
      return;
    }

    const newGoal = {
      id: Date.now(),
      name: goalName.trim(),
      target,
      saved,
    };

    setGoals([...goals, newGoal]);

    setGoalName("");
    setTargetAmount("");
    setSavedAmount("");
  }

  function addMoneyToGoal(goalId) {
    const amount = Number(additionalAmount);

    if (amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setGoals(
      goals.map((goal) => {
        if (goal.id !== goalId) {
          return goal;
        }

        const newSavedAmount = goal.saved + amount;

        if (newSavedAmount > goal.target) {
          alert(
            `You only need ₹${(
              goal.target - goal.saved
            ).toLocaleString("en-IN")} more for this goal.`
          );

          return goal;
        }

        return {
          ...goal,
          saved: newSavedAmount,
        };
      })
    );

    setAdditionalAmount("");
    setAddingToGoal(null);
  }

  function deleteGoal(id) {
    setGoals(
      goals.filter((goal) => goal.id !== id)
    );

    if (addingToGoal === id) {
      setAddingToGoal(null);
      setAdditionalAmount("");
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
      : Math.min(
          Math.round((totalSaved / totalTarget) * 100),
          100
        );

  return (
    <main className="dashboard">

      {/* Add Savings Goal */}
      <section className="card">

        <div className="section-heading">

          <div>
            <span className="section-label">
              SAVINGS PLANNER
            </span>

            <h1>Savings Goals</h1>

            <p>
              Set and track your financial savings goals.
            </p>
          </div>

        </div>

        <div className="update-form">

          <div className="input-group">
            <label>Goal Name</label>

            <input
              type="text"
              placeholder="e.g. Emergency Fund"
              value={goalName}
              onChange={(event) =>
                setGoalName(event.target.value)
              }
            />
          </div>

          <div className="input-group">
            <label>Target Amount</label>

            <div className="input-wrapper">
              <span>₹</span>

              <input
                type="number"
                placeholder="50000"
                min="1"
                value={targetAmount}
                onChange={(event) =>
                  setTargetAmount(event.target.value)
                }
              />
            </div>
          </div>

          <div className="input-group">
            <label>Already Saved</label>

            <div className="input-wrapper">
              <span>₹</span>

              <input
                type="number"
                placeholder="15000"
                min="0"
                value={savedAmount}
                onChange={(event) =>
                  setSavedAmount(event.target.value)
                }
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
            <span className="section-label">
              SAVINGS OVERVIEW
            </span>

            <h2>Overall Progress</h2>

            <p>
              Track your progress across all savings goals.
            </p>
          </div>

          <strong>
            {overallProgress}%
          </strong>

        </div>

        <div className="totals-section">

          <div className="total-box">
            <span>Total Saved</span>

            <strong>
              ₹{totalSaved.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="total-box">
            <span>Total Target</span>

            <strong>
              ₹{totalTarget.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="total-box">
            <span>Goals</span>

            <strong>
              {goals.length}
            </strong>
          </div>

        </div>

      </section>

      {/* Savings Goals */}
      <section className="card">

        <div className="section-heading">

          <div>
            <span className="section-label">
              YOUR GOALS
            </span>

            <h2>My Savings Goals</h2>

            <p>
              Track your progress toward each goal.
            </p>
          </div>

        </div>

        {goals.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              ₹
            </div>

            <h4>No savings goals yet</h4>

            <p>
              Add your first savings goal above.
            </p>

          </div>

        ) : (

          <div className="goals-grid">

            {goals.map((goal) => {

              const percentage = Math.min(
                Math.round(
                  (goal.saved / goal.target) * 100
                ),
                100
              );

              const remaining = Math.max(
                goal.target - goal.saved,
                0
              );

              const isCompleted =
                percentage === 100;

              return (
                <div
                  key={goal.id}
                  className="goal-card"
                >

                  <div className="goal-card-header">

                    <div>
                      <h2>{goal.name}</h2>

                      <p>
                        ₹
                        {goal.saved.toLocaleString(
                          "en-IN"
                        )}{" "}
                        saved of ₹
                        {goal.target.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                    <span className="goal-percentage">
                      {percentage}%
                    </span>

                  </div>

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    ></div>

                  </div>

                  <div className="goal-footer">

                    {isCompleted ? (
                      <strong className="goal-completed">
                        ✓ Goal Completed
                      </strong>
                    ) : (
                      <span>
                        ₹
                        {remaining.toLocaleString(
                          "en-IN"
                        )}{" "}
                        remaining
                      </span>
                    )}

                  </div>

                  {!isCompleted && (
                    <div className="update-form">

                      {addingToGoal === goal.id ? (

                        <>
                          <div className="input-group">

                            <label>
                              Add Money
                            </label>

                            <div className="input-wrapper">
                              <span>₹</span>

                              <input
                                type="number"
                                min="1"
                                placeholder="1000"
                                value={
                                  additionalAmount
                                }
                                onChange={(event) =>
                                  setAdditionalAmount(
                                    event.target.value
                                  )
                                }
                              />

                            </div>

                          </div>

                          <button
                            type="button"
                            className="primary-button"
                            onClick={() =>
                              addMoneyToGoal(
                                goal.id
                              )
                            }
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
                          onClick={() =>
                            setAddingToGoal(
                              goal.id
                            )
                          }
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
                      onClick={() =>
                        deleteGoal(goal.id)
                      }
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