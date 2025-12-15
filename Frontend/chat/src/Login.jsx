import { useState } from "react";
import { apiRequest } from "./api";

export default function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await apiRequest("/login/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          Email: email,
          Password: password,
        }),
      });

      sessionStorage.setItem("access_token", res.access_token);
      onLogin();
    } catch (err) {
      setError(err.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleLogin}
        className="card"
        style={{ width: 340 }}
      >
        <h2 className="heading">Login</h2>

        <div style={{ marginBottom: 12 }}>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn"
          style={{ width: "100%" }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p
            style={{
              color: "red",
              marginTop: 12,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        {/* SWITCH TO REGISTER */}
        <p
          style={{
            marginTop: 14,
            textAlign: "center",
            fontSize: 14,
          }}
        >
          New user?{" "}
          <span
            style={{
              color: "var(--primary)",
              cursor: "pointer",
              fontWeight: 500,
            }}
            onClick={!loading ? onShowRegister : undefined}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
