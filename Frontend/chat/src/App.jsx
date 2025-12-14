import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import ChatRoom from "./ChatRoom";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!sessionStorage.getItem("access_token")
  );
  const [showRegister, setShowRegister] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  // ---------------- NOT LOGGED IN ----------------
  if (!loggedIn) {
    return showRegister ? (
      <>
        <Register onRegistered={() => setShowRegister(false)} />
        <p onClick={() => setShowRegister(false)}>
          Already have an account? Login
        </p>
      </>
    ) : (
      <>
        <Login onLogin={() => setLoggedIn(true)} />
        <p onClick={() => setShowRegister(true)}>
          New user? Register
        </p>
      </>
    );
  }

  // ---------------- CHAT ROOM ----------------
  if (activeChat) {
    return (
      <ChatRoom
        chatId={activeChat}
        onBack={() => setActiveChat(null)}
      />
    );
  }

  // ---------------- HOME ----------------
  return <Home onOpenChat={setActiveChat} />;
}

export default App;
