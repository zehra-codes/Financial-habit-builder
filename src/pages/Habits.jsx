import API_BASE_URL from "../api";
import { useEffect, useState } from "react";

const API_URL = `${API_BASE_URL}/api/habits`;

function Habits() {
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [reminder, setReminder] = useState("20:00");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  function showMessage(text, type = "success") {
    setMessage(text);
    setMessageType(type);
  }

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
        console.error("Error loading habits:", error);
        showMessage(
          error.message || "Could not connect to the backend.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHabits();
  }, []);

  async function addHabit(event) {
    if (event) event.preventDefault();

    const trimmedName = habitName.trim();

    if (!trimmedName) {
      showMessage("Please enter a habit name.", "error");
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
      showMessage("Your new habit has been saved successfully!");
    } catch (error) {
      console.error("Error adding habit:", error);
      showMessage(error.message || "Could not save habit.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function toggleHabit(id) {
    const habit = habits.find((item) => item.id === id);

    if (!habit) return;

    const newCompleted = !habit.completed;
    const newStreak = newCompleted
      ? Number(habit.streak || 0) + 1
      : Math.max(0, Number(habit.streak || 0) - 1);

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

      showMessage(
        newCompleted
          ? "Habit marked as complete!"
          : "Habit marked as incomplete."
      );
    } catch (error) {
      console.error("Error updating habit:", error);
      showMessage(error.message || "Could not update habit.", "error");
    }
  }

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

      showMessage("Habit deleted successfully.");
    } catch (error) {
      console.error("Error deleting habit:", error);
      showMessage(error.message || "Could not delete habit.", "error");
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

  const remainingHabits = totalHabits - completedHabits;

  return (
    <main className="dashboard habits-page">
      <header className="habits-page-header">
        <div>
          <span className="section-label">SMALL STEPS, BIG PROGRESS</span>
          <h1>Financial Habits</h1>
          <p>
            Build consistent money habits, stay accountable, and make
            progress toward your financial goals.
          </p>
        </div>

        <div className="habits-header-badge">
          <span className="habits-header-icon">✓</span>
          <div>
            <strong>{completionPercentage}%</strong>
            <span>Completion rate</span>
          </div>
        </div>
      </header>

      <section className="habits-panel">
        <div className="habits-section-heading">
          <div className="habits-heading-icon">+</div>
          <div>
            <span className="section-label">BUILD YOUR ROUTINE</span>
            <h2>Create a New Habit</h2>
            <p>Choose a habit you want to practise consistently.</p>
          </div>
        </div>

        <form className="habits-create-form" onSubmit={addHabit}>
          <div className="input-group">
            <label htmlFor="habit-name">Habit name</label>
            <input
              id="habit-name"
              type="text"
              placeholder="e.g. Track my expenses"
              value={habitName}
              onChange={(event) => setHabitName(event.target.value)}
              maxLength={80}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="habit-frequency">Frequency</label>
            <select
              id="habit-frequency"
              value={frequency}
              onChange={(event) => setFrequency(event.target.value)}
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="habit-reminder">Reminder time</label>
            <input
              id="habit-reminder"
              type="time"
              value={reminder}
              onChange={(event) => setReminder(event.target.value)}
            />
          </div>

          <button
            type="submit"
            className="primary-button habits-submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "+ Create Habit"}
          </button>
        </form>

        <p className="habits-form-note">
          Choose something manageable that fits naturally into your routine.
        </p>

        {message && (
          <div
            className={`habits-message ${messageType}`}
            role="status"
            aria-live="polite"
          >
            <span>{messageType === "error" ? "!" : "✓"}</span>
            <p>{message}</p>
            <button
              type="button"
              aria-label="Dismiss message"
              onClick={() => setMessage("")}
            >
              ×
            </button>
          </div>
        )}
      </section>

      <section className="habits-performance">
        <div className="habits-performance-heading">
          <div>
            <span className="section-label">YOUR CONSISTENCY</span>
            <h2>Habit Performance</h2>
            <p>A quick overview of your current habit progress.</p>
          </div>
        </div>

        <div className="habits-summary-grid">
          <article className="habits-summary-card">
            <span className="habits-summary-icon completed-icon">✓</span>
            <span className="habits-summary-label">Completed</span>
            <strong>
              {completedHabits}
              <span> / {totalHabits}</span>
            </strong>
            <p>Habits marked complete</p>
          </article>

          <article className="habits-summary-card">
            <span className="habits-summary-icon rate-icon">↗</span>
            <span className="habits-summary-label">Completion rate</span>
            <strong>{completionPercentage}%</strong>
            <p>Based on your current habits</p>
          </article>

          <article className="habits-summary-card">
            <span className="habits-summary-icon streak-icon">✦</span>
            <span className="habits-summary-label">Average streak</span>
            <strong>
              {averageStreak}
              <span> days</span>
            </strong>
            <p>Average recorded streak</p>
          </article>
        </div>

        <div
          className="habits-overall-track"
          role="progressbar"
          aria-label="Habit completion rate"
          aria-valuenow={completionPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div style={{ width: `${completionPercentage}%` }} />
        </div>
      </section>

      <section className="habits-list-section">
        <div className="habits-list-heading">
          <div>
            <span className="section-label">YOUR ROUTINE</span>
            <h2>My Financial Habits</h2>
            <p>
              {loading
                ? "Loading your habits..."
                : remainingHabits === 0 && totalHabits > 0
                  ? "Every habit is marked complete. Great progress!"
                  : `${completedHabits} completed · ${remainingHabits} remaining`}
            </p>
          </div>

          <span className="habits-count">
            {totalHabits} {totalHabits === 1 ? "habit" : "habits"}
          </span>
        </div>

        {loading ? (
          <div className="habits-empty-state">
            <div className="habits-empty-icon">↻</div>
            <h3>Loading your habits</h3>
            <p>Your saved habits are on their way.</p>
          </div>
        ) : habits.length === 0 ? (
          <div className="habits-empty-state">
            <div className="habits-empty-icon">✓</div>
            <h3>Start building better money habits</h3>
            <p>
              You haven't added any habits yet. Create your first one
              above and start building a consistent routine.
            </p>
          </div>
        ) : (
          <div className="habits-list">
            {habits.map((habit) => (
              <article
                key={habit.id}
                className={`habits-item ${
                  habit.completed ? "is-completed" : ""
                }`}
              >
                <div className="habits-item-main">
                  <div
                    className={`habits-completion-mark ${
                      habit.completed ? "checked" : ""
                    }`}
                    aria-hidden="true"
                  >
                    {habit.completed ? "✓" : "○"}
                  </div>

                  <div className="habits-item-content">
                    <div className="habits-item-title-row">
                      <h3>{habit.name}</h3>
                      <span
                        className={`habits-status ${
                          habit.completed ? "done" : "pending"
                        }`}
                      >
                        {habit.completed ? "Completed" : "In progress"}
                      </span>
                    </div>

                    <div className="habits-details">
                      <span>
                        <span className="habits-detail-symbol">↻</span>
                        {habit.frequency}
                      </span>
                      <span>
                        <span className="habits-detail-symbol">◷</span>
                        {habit.reminder || "No reminder"}
                      </span>
                      <span>
                        <span className="habits-detail-symbol">✦</span>
                        {Number(habit.streak || 0)}{" "}
                        {Number(habit.streak || 0) === 1 ? "day" : "days"} streak
                      </span>
                    </div>
                  </div>
                </div>

                <div className="habits-item-actions">
                  <button
                    type="button"
                    className={
                      habit.completed
                        ? "habits-secondary-button"
                        : "primary-button"
                    }
                    onClick={() => toggleHabit(habit.id)}
                  >
                    {habit.completed ? "Undo completion" : "✓ Mark complete"}
                  </button>

                  <button
                    type="button"
                    className="habits-delete-button"
                    onClick={() => deleteHabit(habit.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Habits;
