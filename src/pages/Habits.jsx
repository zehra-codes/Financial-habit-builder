import { useState } from "react";

function Habits() {
  const [habits, setHabits] = useState([
    {
      id: 1,
      name: "No unnecessary spending",
      completed: true,
    },
    {
      id: 2,
      name: "Save ₹100",
      completed: false,
    },
    {
      id: 3,
      name: "Track expenses",
      completed: true,
    },
  ]);

  const [habitName, setHabitName] = useState("");

  function addHabit() {
    const trimmedName = habitName.trim();

    if (!trimmedName) {
      alert("Please enter a habit name.");
      return;
    }

    const newHabit = {
      id: Date.now(),
      name: trimmedName,
      completed: false,
    };

    setHabits([...habits, newHabit]);
    setHabitName("");
  }

  function toggleHabit(id) {
    setHabits(
      habits.map((habit) =>
        habit.id === id
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
  }

  function deleteHabit(id) {
    setHabits(
      habits.filter((habit) => habit.id !== id)
    );
  }

  const completedHabits = habits.filter(
    (habit) => habit.completed
  ).length;

  const totalHabits = habits.length;

  const completionPercentage =
    totalHabits === 0
      ? 0
      : Math.round((completedHabits / totalHabits) * 100);

  return (
    <main className="dashboard">

      {/* Add Habit */}
      <section className="card">

        <div className="section-heading">
          <div>
            <span className="section-label">DAILY HABITS</span>
            <h1>Financial Habits</h1>
            <p>Build and track healthy financial habits.</p>
          </div>
        </div>

        <div className="update-form">

          <div className="input-group">
            <label>New Habit</label>

            <input
              type="text"
              placeholder="e.g. Track expenses"
              value={habitName}
              onChange={(event) =>
                setHabitName(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  addHabit();
                }
              }}
            />
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={addHabit}
          >
            + Add Habit
          </button>

        </div>

      </section>

      {/* Today's Progress */}
      <section className="card">

        <div className="section-heading">
          <div>
            <span className="section-label">
              TODAY'S PROGRESS
            </span>

            <h2>My Financial Habits</h2>

            <p>
              {completedHabits} of {totalHabits} habits completed today.
            </p>
          </div>

          <strong>
            {completionPercentage}%
          </strong>
        </div>

        {/* Habit List */}
        {habits.length === 0 ? (

          <div className="empty-state">
            <div className="empty-icon">✓</div>

            <h4>No habits yet</h4>

            <p>
              Add your first financial habit above to start tracking.
            </p>
          </div>

        ) : (

          <div className="habit-list">

            {habits.map((habit) => (

              <div
                key={habit.id}
                className="habit-card"
              >

                <div>
                  <h2>{habit.name}</h2>

                  <p>
                    {habit.completed
                      ? "☑ Completed today"
                      : "☐ Not completed yet"}
                  </p>
                </div>

                <div className="habit-actions">

                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => toggleHabit(habit.id)}
                  >
                    {habit.completed
                      ? "Mark Incomplete"
                      : "Mark Complete"}
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteHabit(habit.id)}
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default Habits;