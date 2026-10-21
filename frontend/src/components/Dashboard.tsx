import { useAuth } from '../context/useAuth';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <main className="dashboard">
      {/* Top navigation */}
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="dashboard-logo">Z</div>

          <div>
            <h1>Zenvora</h1>
            <p>Personal Finance</p>
          </div>
        </div>

        <button
          className="dashboard-logout"
          onClick={logout}
        >
          Log out
        </button>
      </header>

      {/* Welcome section */}
      <section className="dashboard-welcome">
        <p className="dashboard-eyebrow">
          YOUR OVERVIEW
        </p>

        <h2>
          Welcome back{user ? `, ${user.name}` : ''}!
        </h2>

        <p>
          Here's an overview of your personal finances.
        </p>
      </section>

      {/* Financial summary */}
      <section className="dashboard-stats">
        <article className="dashboard-stat-card">
          <p>Total balance</p>
          <h3>R 0.00</h3>
          <span>Across all accounts</span>
        </article>

        <article className="dashboard-stat-card">
          <p>Monthly income</p>
          <h3>R 0.00</h3>
          <span>This month</span>
        </article>

        <article className="dashboard-stat-card">
          <p>Monthly expenses</p>
          <h3>R 0.00</h3>
          <span>This month</span>
        </article>

        <article className="dashboard-stat-card">
          <p>Money remaining</p>
          <h3>R 0.00</h3>
          <span>Income minus expenses</span>
        </article>
      </section>

      {/* Recent activity */}
      <section className="dashboard-section">
        <div>
          <h2>Recent transactions</h2>
          <p>
            Keep track of your latest income and spending.
          </p>
        </div>

        <div className="dashboard-empty-state">
          <p>No transactions yet</p>
          <span>
            Your transactions will appear here once you
            start recording your financial activity.
          </span>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
