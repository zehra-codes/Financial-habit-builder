function Welcome({ name, income, expenses }) {

  return (
    <div>
      <h2>Your Financial Overview</h2>
      <p>My income: ₹{income}</p>
      <p>My expenses: ₹{expenses}</p>
      <p>You can save: ₹{income - expenses}</p>
    </div>
  );
}

export default Welcome;