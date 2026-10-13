import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [showSignup, setShowSignup] = useState(false);

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
