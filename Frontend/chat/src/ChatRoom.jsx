import { useEffect, useRef, useState } from "react";
import { apiRequest, API_BASE } from "./api";
import { formatTime } from "./time";

export default function ChatRoom({ chatId, chatName, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const myUsername = sessionStorage.getItem("username");

  // -------------------------
  // Load history + connect WS
  // -------------------------
  useEffect(() => {
    if (!chatId || socketRef.current) return;

    let socket;

    async function setupChat() {
      try {
        const res = await apiRequest(`/chat/${chatId}/history/`);
        setMessages(res.messages || []);

        const token = sessionStorage.getItem("access_token");
        const wsUrl =
          API_BASE.replace("https", "wss") +
          `/ws/chat/${chatId}/?token=${token}`;

        socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onmessage = (e) => {
          const data = JSON.parse(e.data);
          setMessages((prev) => [...prev, data]);
        };
      } catch (err) {
        console.error("Chat setup failed", err);
      }
    }

    setupChat();

    return () => {
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [chatId]);

  // -------------------------
  // Auto-scroll
  // -------------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -------------------------
  // Send message
  // -------------------------
  function sendMessage() {
    if (
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN ||
      !text.trim()
    )
      return;

    socketRef.current.send(JSON.stringify({ message: text }));
    setText("");
  }

  return (
    <div className="chat-container">
      {/* HEADER */}
      <div className="chat-header">
        <button className="btn-outline" onClick={onBack}>
          ⬅ Back
        </button>
        <div className="chat-title">
          {chatName || `Chat #${chatId}`}
        </div>
      </div>

      {/* MESSAGES */}
      <div className="chat-body">
        {messages.map((m, i) => {
          const isMine = m.sender === myUsername;

          return (
            <div
              key={i}
              className={`chat-bubble ${isMine ? "mine" : "theirs"}`}
            >
              {!isMine && (
                <div className="chat-sender">{m.sender}</div>
              )}

              <div className="chat-text">{m.message}</div>

              <div className="chat-time">
                {formatTime(m.created_at)}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="btn" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
