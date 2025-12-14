import { useEffect, useState } from "react";
import { apiRequest } from "./api";

export default function OneToOne({ onOpenChat }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const res = await apiRequest("/users/");
    setUsers(res.users || []);
  }

  async function startChat(userId) {
    const res = await apiRequest("/chat/private/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ user_id: userId }),
    });

    onOpenChat(res.chat_id);
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>One-to-One Chat</h2>

      {users.map(u => (
        <div
          key={u.userid}
          style={{ border: "1px solid #ccc", padding: 10, marginBottom: 5 }}
        >
          <b>{u.username}</b>
          <br />
          <button onClick={() => startChat(u.userid)}>
            Text him
          </button>
        </div>
      ))}
    </div>
  );
}
