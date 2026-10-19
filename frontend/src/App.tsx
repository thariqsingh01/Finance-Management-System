import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthTest from './AuthTest';
import { useAuth } from './context/useAuth';

function App() {
  const [showSignup, setShowSignup] = useState(false);
  const { user } = useAuth();

  if (user) {
    return <AuthTest />;
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
