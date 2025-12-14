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

      // remove self
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
  // Start / Open private chat
  // -------------------------
  async function startChat(userId) {
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

      // 🔥 THIS opens ChatRoom
      onOpenChat(res.chat_id);

    } catch (err) {
      console.error(err);
      setError("Failed to open chat");
    } finally {
      setStartingChat(null);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>One-to-One Chat</h2>

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && users.length === 0 && (
        <p>No users available</p>
      )}

      {!loading &&
        users.map((u) => (
          <div
            key={u.userid}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 8,
            }}
          >
            <b>{u.username}</b>
            <br />

            <button
              onClick={() => startChat(u.userid)}
              disabled={startingChat === u.userid}
            >
              {startingChat === u.userid ? "Opening..." : "Text him"}
            </button>
          </div>
        ))}
    </div>
  );
}
