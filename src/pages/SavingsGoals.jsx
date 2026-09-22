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

  function addGoal() {
    if (!goalName || !targetAmount || !savedAmount) {
      return;
    }

    const newGoal = {
      id: Date.now(),
      name: goalName,
      target: Number(targetAmount),
      saved: Number(savedAmount),
    };

    setGoals([...goals, newGoal]);

    setGoalName("");
    setTargetAmount("");
    setSavedAmount("");
  }

  function deleteGoal(id) {
    setGoals(goals.filter((goal) => goal.id !== id));
  }

  return (
    <main className="dashboard">

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
                placeholder="50000"
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
                value={savedAmount}
                onChange={(event) =>
                  setSavedAmount(event.target.value)
                }
              />
            </div>
          </div>

          <button
            className="primary-button"
            onClick={addGoal}
          >
            + Add Savings Goal
          </button>

        </div>
      </section>

      <section className="card">
        <div className="section-heading">
          <div>
            <span className="section-label">YOUR GOALS</span>
            <h2>My Savings Goals</h2>
            <p>Track your progress toward each goal.</p>
          </div>
        </div>

        {goals.map((goal) => {
          const percentage = Math.min(
            Math.round((goal.saved / goal.target) * 100),
            100
          );

          return (
            <div key={goal.id} className="goal-card">

              <h2>{goal.name}</h2>

              <p>
                ₹{goal.saved.toLocaleString("en-IN")} / ₹
                {goal.target.toLocaleString("en-IN")}
              </p>

              <p>{percentage}% completed</p>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <button
                className="primary-button"
                onClick={() => deleteGoal(goal.id)}
              >
                Delete Goal
              </button>

            </div>
          );
        })}

      </section>

    </main>
  );
}

export default SavingsGoals;