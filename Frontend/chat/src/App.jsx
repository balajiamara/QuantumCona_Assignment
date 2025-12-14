import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import ChatRoom from "./ChatRoom";

function App() {
  // AUTH
  const [loggedIn, setLoggedIn] = useState(
    !!sessionStorage.getItem("access_token")
  );
  const [showRegister, setShowRegister] = useState(false);

  // ACTIVE CHAT (persist)
  const [activeChat, setActiveChat] = useState(
    sessionStorage.getItem("active_chat")
  );

  useEffect(() => {
    if (activeChat) {
      sessionStorage.setItem("active_chat", activeChat);
    } else {
      sessionStorage.removeItem("active_chat");
    }
  }, [activeChat]);

  // ---------- NOT LOGGED IN ----------
  if (!loggedIn) {
    return showRegister ? (
      <>
        <Register onRegistered={() => setShowRegister(false)} />
        <p
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => setShowRegister(false)}
        >
          Already have an account? Login
        </p>
      </>
    ) : (
      <>
        <Login onLogin={() => setLoggedIn(true)} />
        <p
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => setShowRegister(true)}
        >
          New user? Register
        </p>
      </>
    );
  }

  // ---------- CHAT ROOM ----------
  if (activeChat) {
    return (
      <ChatRoom
        chatId={activeChat}
        onBack={() => setActiveChat(null)}
      />
    );
  }

  // ---------- HOME ----------
  return (
    <Home
      onOpenChat={(chatId) => setActiveChat(chatId)}
    />
  );
}

export default App;
