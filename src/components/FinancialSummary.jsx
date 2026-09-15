function FinancialSummary({ income, expenses }) {
  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  return (
    <section>
      <h2>Financial Summary</h2>

      <div>
        <div>
          <h3>Income</h3>
          <p>₹{income}</p>
        </div>

        <div>
          <h3>Expenses</h3>
          <p>₹{expenses}</p>
        </div>

        <div>
          <h3>Savings</h3>
          <p>₹{savings}</p>
        </div>
        <div>
            <h3>Savings Rate</h3>
            <p>{savingsRate.toFixed(1)}%</p>
        </div>
      </div>
    </section>
  );
}

export default FinancialSummary;