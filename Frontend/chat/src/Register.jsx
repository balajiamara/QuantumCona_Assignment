import { useState } from "react";
import { apiRequest } from "./api";

export default function Register({ onRegistered }) {
  const [form, setForm] = useState({
    Username: "",
    Email: "",
    Password: "",
  });

  async function handleRegister(e) {
    e.preventDefault();

    await apiRequest("/reg_user/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(form),
    });

    alert("Registered successfully. Please login.");
    onRegistered();
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
      onSubmit={handleRegister}
      className="card"
      style={{ width: 340 }}
    >
      <h2 className="heading">Register</h2>

      <div style={{ marginBottom: 12 }}>
        <input
          className="input"
          placeholder="Username"
          value={form.Username}
          onChange={(e) =>
            setForm({ ...form, Username: e.target.value })
          }
          required
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={form.Email}
          onChange={(e) =>
            setForm({ ...form, Email: e.target.value })
          }
          required
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={form.Password}
          onChange={(e) =>
            setForm({ ...form, Password: e.target.value })
          }
          required
        />
      </div>

      <button type="submit" className="btn" style={{ width: "100%" }}>
        Register
      </button>

      {/* ✅ AUTH SWITCH LINK */}
      <p
        style={{
          marginTop: 14,
          textAlign: "center",
          fontSize: 14,
        }}
      >
        Already have an account?{" "}
        <span
          style={{
            color: "var(--primary)",
            cursor: "pointer",
            fontWeight: 500,
          }}
          onClick={onRegistered}
        >
          Login
        </span>
      </p>
    </form>
  </div>
);
}