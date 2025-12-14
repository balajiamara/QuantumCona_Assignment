import { useEffect, useState } from "react";
import { apiRequest } from "./api";

export default function ChatList({ onSelect }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function loadChats() {
      const res = await apiRequest("/chat/list/");
      setChats(res.chats);
    }
    loadChats();
  }, []);

  return (
    <div>
      <h2>Your Chats</h2>

      {chats.length === 0 && <p>No chats yet</p>}

      {chats.map((c) => (
        <div
          key={c.chat_id}
          style={{ border: "1px solid #ccc", padding: 10, margin: 5 }}
          onClick={() => onSelect(c.chat_id)}
        >
          <b>{c.is_group ? "Group Chat" : "Private Chat"}</b>
          <br />
          <small>Chat ID: {c.chat_id}</small>
        </div>
      ))}
    </div>
  );
}
