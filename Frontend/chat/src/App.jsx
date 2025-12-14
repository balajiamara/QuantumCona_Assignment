import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!sessionStorage.getItem("access_token")
  );
  const [showRegister, setShowRegister] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  // -------------------------
  // NOT LOGGED IN
  // -------------------------
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

  // -------------------------
  // LOGGED IN → CHAT ROOM
  // -------------------------
  if (selectedChat) {
    return (
      <ChatRoom
        chatId={selectedChat}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  // -------------------------
  // LOGGED IN → CHAT LIST
  // -------------------------
  return (
    <ChatList
      onSelect={(chatId) => setSelectedChat(chatId)}
    />
  );
}

export default App;
