import { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Finance Management System</h1>
        <p>Sign in to manage your finances.</p>

        {error && <p className="error-message">{error}</p>}
        
        <form
          onSubmit={(event) => {
            event.preventDefault();

            setError('');

            if (!email) {
              setError('Email is required.');
              return;
            }

            if (!password) {
              setError('Password is required.');
              return;
            }

            console.log('Email:', email);
            console.log('Password:', password);
          }}
        >
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button type="submit">Sign In</button>
        </form>

        <p className="register-link">
          Don't have an account? <a href="#">Create an account</a>
        </p>
      </section>
    </main>
  );
}

export default Login;