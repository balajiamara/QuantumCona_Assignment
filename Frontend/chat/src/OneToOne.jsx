import { useEffect, useState } from "react";
import { apiRequest } from "./api";

export default function OneToOne({ onOpenChat }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startingChat, setStartingChat] = useState(null);
  const [error, setError] = useState("");

  const myUserId = Number(sessionStorage.getItem("user_id"));

  // -------------------------
  // Load users
  // -------------------------
  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const res = await apiRequest("/users/");
      const list = res.users || [];

      const filtered = list.filter(
        (u) => Number(u.userid) !== myUserId
      );

      setUsers(filtered);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------
  // Start private chat
  // -------------------------
  async function startChat(userId, username) {
    if (startingChat === userId) return;

    try {
      setStartingChat(userId);
      setError("");

      const res = await apiRequest("/chat/private/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ user_id: userId }),
      });

      if (!res.chat_id) {
        throw new Error("Chat ID missing");
      }

      onOpenChat(res.chat_id, username);

    } catch (err) {
      console.error(err);
      setError("Failed to open chat");
    } finally {
      setStartingChat(null);
    }
  }

  return (
    <div style={{ maxWidth: 650, margin: "auto", padding: 20 }}>
      <h2 className="heading">One-to-One Chat</h2>

      {loading && <p>Loading users...</p>}

      {error && (
        <p style={{ color: "red", marginBottom: 10 }}>
          {error}
        </p>
      )}

      {!loading && users.length === 0 && (
        <p>No users available</p>
      )}

      {!loading &&
        users.map((u) => (
          <div key={u.userid} className="group-card">
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1e3a8a", // dark blue
                marginBottom: 6,
              }}
            >
              {u.username}
            </div>

            <button
              className="btn"
              disabled={startingChat === u.userid}
              onClick={() => startChat(u.userid, u.username)}
            >
              {startingChat === u.userid ? "Opening…" : "Text"}
            </button>
          </div>
        ))}
    </div>
  );
}
