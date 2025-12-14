import { useEffect, useRef, useState } from "react";
import { apiRequest, API_BASE } from "./api";

export default function Chat() {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);

  // Create chat on mount
  useEffect(() => {
    async function initChat() {
      const res = await apiRequest("/chat/create/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ is_group: "true" }),
      });

      setChatId(res.chat_id);
    }
    initChat();
  }, []);

  // Load history + connect websocket
  useEffect(() => {
    if (!chatId) return;

    async function loadHistory() {
      const res = await apiRequest(`/chat/${chatId}/history/`);
      setMessages(res.messages);
    }

    loadHistory();

    const token = sessionStorage.getItem("access_token");

    const wsUrl = API_BASE.replace("https", "wss") +
      `/ws/chat/${chatId}/?token=${token}`;

    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => socketRef.current?.close();
  }, [chatId]);

  function sendMessage() {
    socketRef.current.send(
      JSON.stringify({ message: text })
    );
    setText("");
  }

  return (
    <div>
      <h2>Chat Room #{chatId}</h2>

      <div style={{ border: "1px solid #ccc", padding: 10 }}>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.sender}:</b> {m.message}
          </p>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message"
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
