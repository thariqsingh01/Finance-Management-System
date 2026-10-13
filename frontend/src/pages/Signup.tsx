import { useState } from "react";

type SignupProps = {
  onSwitchToLogin: () => void;
};

function Signup({ onSwitchToLogin }: SignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Create an Account</h1>
        <p>Start managing your finances.</p>

        {error && <p className="error-message">{error}</p>}

        {success && <p>{success}</p>}

        <form
          onSubmit={async (event) => {
            event.preventDefault();

            setError("");
            setSuccess("");

            if (!name.trim() || !email.trim() || !password) {
              setError("Please complete all required fields.");
              return;
            }

            setLoading(true);

            try {
              const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    address: address.trim() || null,
                    password,
                  }),
                },
              );

              const data = await response.json();

              if (!response.ok) {
                setError(data.message || "Registration failed.");
                return;
              }

              setSuccess("Account created successfully! You can now sign in.");

              setName("");
              setEmail("");
              setAddress("");
              setPassword("");
            } catch (error) {
              console.error("Registration request failed:", error);

              setError("Unable to connect to the server.");
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="form-group">
            <label htmlFor="name">Full Name</label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address (optional)</label>

            <input
              id="address"
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="register-link">
          Already have an account?{" "}
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              onSwitchToLogin();
            }}
          >
            Sign in
          </a>
        </p>
      </section>
    </main>
  );
}

export default Signup;
