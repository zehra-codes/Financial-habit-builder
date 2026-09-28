import { useState } from "react";

function Habits() {
  const [habits, setHabits] = useState([
    {
      id: 1,
      name: "No unnecessary spending",
      frequency: "Daily",
      completed: true,
      streak: 3,
      reminder: "08:00",
    },
    {
      id: 2,
      name: "Save ₹100",
      frequency: "Daily",
      completed: false,
      streak: 2,
      reminder: "20:00",
    },
    {
      id: 3,
      name: "Track expenses",
      frequency: "Daily",
      completed: true,
      streak: 5,
      reminder: "21:00",
    },
  ]);

  const [habitName, setHabitName] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [reminder, setReminder] = useState("20:00");

  function addHabit() {
    const trimmedName = habitName.trim();

    if (!trimmedName) {
      alert("Please enter a habit name.");
      return;
    }

    const newHabit = {
      id: Date.now(),
      name: trimmedName,
      frequency,
      completed: false,
      streak: 0,
      reminder,
    };

    setHabits([...habits, newHabit]);

    setHabitName("");
    setFrequency("Daily");
    setReminder("20:00");
  }

  function toggleHabit(id) {
    setHabits(
      habits.map((habit) => {
        if (habit.id !== id) {
          return habit;
        }

        const newCompleted = !habit.completed;

        return {
          ...habit,
          completed: newCompleted,
          streak: newCompleted
            ? habit.streak + 1
            : Math.max(0, habit.streak - 1),
        };
      })
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
      : Math.round(
          (completedHabits / totalHabits) * 100
        );

  const totalStreak = habits.reduce(
    (total, habit) => total + habit.streak,
    0
  );

  const averageStreak =
    totalHabits === 0
      ? 0
      : Math.round(totalStreak / totalHabits);

  return (
    <main className="dashboard">

      {/* Add Habit */}
      <section className="card">

        <div className="section-heading">
          <div>
            <span className="section-label">
              DAILY HABITS
            </span>

            <h1>Financial Habits</h1>

            <p>
              Build and track healthy financial habits.
            </p>
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

          <div className="input-group">
            <label>Frequency</label>

            <select
              value={frequency}
              onChange={(event) =>
                setFrequency(event.target.value)
              }
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div className="input-group">
            <label>Reminder</label>

            <input
              type="time"
              value={reminder}
              onChange={(event) =>
                setReminder(event.target.value)
              }
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

      {/* Habit Performance */}
      <section className="card">

        <div className="section-heading">

          <div>
            <span className="section-label">
              PERFORMANCE
            </span>

            <h2>Habit Performance</h2>

            <p>
              Track your completion rate and current
              habit streaks.
            </p>
          </div>

          <strong>
            {completionPercentage}%
          </strong>

        </div>

        <div className="totals-section">

          <div className="total-box">
            <span>Completed Today</span>

            <strong>
              {completedHabits}/{totalHabits}
            </strong>
          </div>

          <div className="total-box">
            <span>Completion Rate</span>

            <strong>
              {completionPercentage}%
            </strong>
          </div>

          <div className="total-box">
            <span>Average Streak</span>

            <strong>
              {averageStreak} days
            </strong>
          </div>

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
              {completedHabits} of {totalHabits} habits
              completed today.
            </p>
          </div>

        </div>

        {/* Habit List */}
        {habits.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              ✓
            </div>

            <h4>No habits yet</h4>

            <p>
              Add your first financial habit above to
              start tracking.
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

                  <h2>
                    {habit.name}
                  </h2>

                  <p>
                    {habit.completed
                      ? "☑ Completed today"
                      : "☐ Not completed yet"}
                  </p>

                  <p>
                    Frequency: {habit.frequency}
                  </p>

                  <p>
                    Current streak: {habit.streak} day
                    {habit.streak !== 1 ? "s" : ""}
                  </p>

                  <p>
                    Reminder: {habit.reminder}
                  </p>

                </div>

                <div className="habit-actions">

                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      toggleHabit(habit.id)
                    }
                  >
                    {habit.completed
                      ? "Mark Incomplete"
                      : "Mark Complete"}
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      deleteHabit(habit.id)
                    }
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