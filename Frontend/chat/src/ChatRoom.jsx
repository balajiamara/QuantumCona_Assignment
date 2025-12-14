import { useEffect, useRef, useState } from "react";
import { apiRequest, API_BASE } from "./api";

export default function ChatRoom({ chatId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);

  // -------------------------
  // Load history + connect WS
  // -------------------------
  useEffect(() => {
    if (!chatId) return;

    let socket;

    async function setupChat() {
      try {
        // 1️⃣ Load chat history
        const res = await apiRequest(`/chat/${chatId}/history/`);
        setMessages(res.messages);

        // 2️⃣ Get access token
        const token = sessionStorage.getItem("access_token");
        if (!token) {
          console.error("No access token found");
          return;
        }

        // 3️⃣ WebSocket URL
        const wsUrl =
          API_BASE.replace("https", "wss") +
          `/ws/chat/${chatId}/?token=${token}`;

        console.log("🔌 Connecting WebSocket:", wsUrl);

        socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          console.log("✅ WebSocket connected");
        };

        socket.onmessage = (e) => {
          const data = JSON.parse(e.data);
          setMessages((prev) => [...prev, data]);
        };

        socket.onerror = (e) => {
          console.error("❌ WebSocket error", e);
        };

        socket.onclose = () => {
          console.log("🔌 WebSocket closed");
        };
      } catch (err) {
        console.error("Chat setup failed", err);
      }
    }

    setupChat();

    return () => {
      if (socket) socket.close();
    };
  }, [chatId]);

  // -------------------------
  // Send message
  // -------------------------
  function sendMessage() {
    if (!socketRef.current) return;

    if (socketRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not open");
      return;
    }

    if (!text.trim()) return;

    socketRef.current.send(
      JSON.stringify({ message: text })
    );

    setText("");
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <button onClick={onBack}>⬅ Back to chats</button>

      <h2>Chat Room #{chatId}</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 300,
          overflowY: "auto",
          marginBottom: 10,
        }}
      >
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
        style={{ width: "80%" }}
      />

      <button onClick={sendMessage} style={{ width: "18%", marginLeft: "2%" }}>
        Send
      </button>
    </div>
  );
}
