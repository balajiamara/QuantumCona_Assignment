import { useEffect, useState } from "react";
import { apiRequest } from "./api";

export default function ChatList({ onSelect }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function loadChats() {
      const res = await apiRequest("/chat/list/");
      setChats(res.chats || []);
    }
    loadChats();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2 className="heading">Your Chats</h2>

      {chats.length === 0 && (
        <p style={{ color: "var(--muted)" }}>No chats yet</p>
      )}

      {chats.map((c) => (
        <div
          key={c.chat_id}
          className="group-card"
          onClick={() => onSelect(c.chat_id)}
          style={{ cursor: "pointer" }}
        >
          <b>{c.is_group ? "Group Chat" : "Private Chat"}</b>
          <br />
          <small>Chat ID: {c.chat_id}</small>
        </div>
      ))}
    </div>
  );
}
