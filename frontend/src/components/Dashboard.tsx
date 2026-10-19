import { useAuth } from '../context/useAuth';

function Dashboard() {
  const { user } = useAuth();

  return (
    <main>
      <h1>
        Welcome back{user ? `, ${user.name}` : ''}!
      </h1>

      <p>
        Welcome to your Personal Finance Management System.
      </p>
    </main>
  );
}

export default Dashboard;
