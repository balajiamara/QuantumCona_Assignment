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
    <form onSubmit={handleRegister}>
      <h2>Register</h2>

      <input
        placeholder="Username"
        onChange={(e) =>
          setForm({ ...form, Username: e.target.value })
        }
      />
      <input
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, Email: e.target.value })
        }
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, Password: e.target.value })
        }
      />

      <button>Register</button>
    </form>
  );
}
