import { useAuth } from './context/useAuth';

function AuthTest() {
  const { user, token, logout } = useAuth();

  return (
    <div>
      <h2>Authentication Test</h2>

      <p>
        Status: {user ? 'Logged in' : 'Not logged in'}
      </p>

      <p>
        User: {user ? user.name : 'No user'}
      </p>

      <p>
        Token: {token ? 'Token exists' : 'No token'}
      </p>

      {user && (
        <button onClick={logout}>
          Log out
        </button>
      )}
    </div>
  );
}

export default AuthTest;