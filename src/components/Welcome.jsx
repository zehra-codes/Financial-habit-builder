function Welcome() {
  const name = "Qunoot";
  const income = 15000;
  const expenses = 6500;

  return (
    <div>
      <h2>Welcome, {name}!</h2>
      <p>My income: ₹{income}</p>
      <p>My expenses: ₹{expenses}</p>
      <p>You can save: ₹{income - expenses}</p>
    </div>
  );
}

export default Welcome;