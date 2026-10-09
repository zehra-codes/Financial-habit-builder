
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/habits";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [reminder, setReminder] = useState("20:00");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Load habits from MongoDB
  useEffect(() => {
    async function fetchHabits() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Could not load habits.");
        }

        setHabits(
          data.habits.map((habit) => ({
            ...habit,
            id: habit._id,
          }))
        );
      } catch (error) {
        setMessage(error.message || "Could not connect to the backend.");
      } finally {
        setLoading(false);
      }
    }

    fetchHabits();
  }, []);

  // Add habit to MongoDB
  async function addHabit() {
    const trimmedName = habitName.trim();

    if (!trimmedName) {
      setMessage("Please enter a habit name.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          frequency,
          completed: false,
          streak: 0,
          reminder,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not add habit.");
      }

      setHabits((previous) => [
        ...previous,
        { ...data.habit, id: data.habit._id },
      ]);

      setHabitName("");
      setFrequency("Daily");
      setReminder("20:00");
      setMessage("Habit saved successfully!");
    } catch (error) {
      setMessage(error.message || "Could not save habit.");
    } finally {
      setSaving(false);
    }
  }

  // Update completion status in MongoDB
  async function toggleHabit(id) {
    const habit = habits.find((item) => item.id === id);

    if (!habit) return;

    const newCompleted = !habit.completed;
    const newStreak = newCompleted
      ? habit.streak + 1
      : Math.max(0, habit.streak - 1);

    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: newCompleted,
          streak: newStreak,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not update habit.");
      }

      setHabits((previous) =>
        previous.map((item) =>
          item.id === id
            ? { ...data.habit, id: data.habit._id }
            : item
        )
      );

      setMessage("Habit updated successfully!");
    } catch (error) {
      setMessage(error.message || "Could not update habit.");
    }
  }

  // Delete habit from MongoDB
  async function deleteHabit(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this habit?"
    );

    if (!confirmed) return;

    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not delete habit.");
      }

      setHabits((previous) =>
        previous.filter((habit) => habit.id !== id)
      );

      setMessage("Habit deleted successfully!");
    } catch (error) {
      setMessage(error.message || "Could not delete habit.");
    }
  }

  const completedHabits = habits.filter(
    (habit) => habit.completed
  ).length;

  const totalHabits = habits.length;

  const completionPercentage =
    totalHabits === 0
      ? 0
      : Math.round((completedHabits / totalHabits) * 100);

  const totalStreak = habits.reduce(
    (total, habit) => total + Number(habit.streak || 0),
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
              onChange={(event) => setHabitName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addHabit();
              }}
            />
          </div>

          <div className="input-group">
            <label>Frequency</label>
            <select
              value={frequency}
              onChange={(event) => setFrequency(event.target.value)}
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
              onChange={(event) => setReminder(event.target.value)}
            />
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={addHabit}
            disabled={saving}
          >
            {saving ? "Saving..." : "+ Add Habit"}
          </button>
        </div>

        {message && (
          <p role="status" aria-live="polite">
            {message}
          </p>
        )}
      </section>

      {/* Habit Performance */}
      <section className="card">
        <div className="section-heading">
          <div>
            <span className="section-label">PERFORMANCE</span>
            <h2>Habit Performance</h2>
            <p>
              Track your completion rate and current habit streaks.
            </p>
          </div>
          <strong>{completionPercentage}%</strong>
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
            <strong>{completionPercentage}%</strong>
          </div>

          <div className="total-box">
            <span>Average Streak</span>
            <strong>{averageStreak} days</strong>
          </div>
        </div>
      </section>

      {/* Today's Progress */}
      <section className="card">
        <div className="section-heading">
          <div>
            <span className="section-label">TODAY'S PROGRESS</span>
            <h2>My Financial Habits</h2>
            <p>
              {completedHabits} of {totalHabits} habits completed today.
            </p>
          </div>
        </div>

        {loading ? (
          <p>Loading habits from MongoDB...</p>
        ) : habits.length === 0 ? (
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
              <div key={habit.id} className="habit-card">
                <div>
                  <h2>{habit.name}</h2>

                  <p>
                    {habit.completed
                      ? "☑ Completed today"
                      : "☐ Not completed yet"}
                  </p>

                  <p>Frequency: {habit.frequency}</p>

                  <p>
                    Current streak: {habit.streak} day
                    {habit.streak !== 1 ? "s" : ""}
                  </p>

                  <p>Reminder: {habit.reminder}</p>
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
