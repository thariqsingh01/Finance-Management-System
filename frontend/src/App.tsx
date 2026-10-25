import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './context/useAuth';
import Dashboard from './components/Dashboard';
import Accounts from './pages/Accounts';
import './App.css';

function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'accounts'>('dashboard');
  const { user } = useAuth();

  if (user) {
    return (
      <>
        <nav className="app-navigation">
          <button
            className={currentPage === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentPage('dashboard')}
          >
            Dashboard
          </button>

          <button
            className={currentPage === 'accounts' ? 'active' : ''}
            onClick={() => setCurrentPage('accounts')}
          >
            Accounts
          </button>
        </nav>

        {currentPage === 'dashboard' ? <Dashboard /> : <Accounts />}
      </>
    );
  }

  return (
    <>
      {showSignup ? (
        <Signup onSwitchToLogin={() => setShowSignup(false)} />
      ) : (
        <Login onSwitchToSignup={() => setShowSignup(true)} />
      )}
    </>
  );
}

export default App;
