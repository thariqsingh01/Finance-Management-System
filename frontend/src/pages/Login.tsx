function Login() {
  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Finance Management System</h1>
        <p>Sign in to manage your finances.</p>

        <form>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
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