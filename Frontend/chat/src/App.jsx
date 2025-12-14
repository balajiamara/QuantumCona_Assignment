import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import ChatRoom from "./ChatRoom";

function App() {
  // -------------------------
  // AUTH STATE
  // -------------------------
  const [loggedIn, setLoggedIn] = useState(
    !!sessionStorage.getItem("access_token")
  );

  const [showRegister, setShowRegister] = useState(false);

  // -------------------------
  // ACTIVE CHAT (persisted)
  // -------------------------
  const [activeChat, setActiveChat] = useState(
    sessionStorage.getItem("active_chat")
  );

  // -------------------------
  // Sync auth state
  // -------------------------
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    setLoggedIn(!!token);
  }, []);

  // -------------------------
  // Persist active chat
  // -------------------------
  useEffect(() => {
    if (activeChat) {
      sessionStorage.setItem("active_chat", activeChat);
    } else {
      sessionStorage.removeItem("active_chat");
    }
  }, [activeChat]);

  // -------------------------
  // LOGOUT helper (future use)
  // -------------------------
  function logout() {
    sessionStorage.clear();
    setActiveChat(null);
    setLoggedIn(false);
  }

  // =========================
  // NOT LOGGED IN
  // =========================
  if (!loggedIn) {
    return showRegister ? (
      <div style={{ maxWidth: 400, margin: "auto" }}>
        <Register onRegistered={() => setShowRegister(false)} />
        <p
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => setShowRegister(false)}
        >
          Already have an account? Login
        </p>
      </div>
    ) : (
      <div style={{ maxWidth: 400, margin: "auto" }}>
        <Login onLogin={() => setLoggedIn(true)} />
        <p
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => setShowRegister(true)}
        >
          New user? Register
        </p>
      </div>
    );
  }

  // =========================
  // CHAT ROOM
  // =========================
  if (activeChat) {
    return (
      <ChatRoom
        chatId={activeChat}
        onBack={() => setActiveChat(null)}
      />
    );
  }

  // =========================
  // HOME (Groups + One-to-One)
  // =========================
  return (
    <Home
      onOpenChat={(chatId) => setActiveChat(chatId)}
      onLogout={logout} // optional use later
    />
  );
}

export default App;
