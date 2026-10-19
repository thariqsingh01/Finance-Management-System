import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './context/useAuth';
import Dashboard from './components/Dashboard';

function App() {
  const [showSignup, setShowSignup] = useState(false);
  const { user } = useAuth();

  if (user) {
    return <Dashboard />;
  }

  return (
    <>
      {showSignup ? (
        <Signup
          onSwitchToLogin={() => setShowSignup(false)}
        />
      ) : (
        <Login
          onSwitchToSignup={() => setShowSignup(true)}
        />
      )}
    </>
  );
}

export default App;
