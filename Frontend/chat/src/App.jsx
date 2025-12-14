import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import ChatRoom from "./ChatRoom";

function App() {
  // =========================
  // AUTH STATE
  // =========================
  const [loggedIn, setLoggedIn] = useState(
    !!sessionStorage.getItem("access_token")
  );
  const [showRegister, setShowRegister] = useState(false);

  // =========================
  // ACTIVE CHAT STATE
  // =========================
  const [activeChatId, setActiveChatId] = useState(
    sessionStorage.getItem("active_chat_id")
  );
  const [activeChatName, setActiveChatName] = useState(
    sessionStorage.getItem("active_chat_name") || ""
  );

  // =========================
  // THEME STATE
  // =========================
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // Apply theme globally
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Sync auth on reload
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    setLoggedIn(!!token);
  }, []);

  // Persist active chat
  useEffect(() => {
    if (activeChatId) {
      sessionStorage.setItem("active_chat_id", activeChatId);
      sessionStorage.setItem("active_chat_name", activeChatName || "");
    } else {
      sessionStorage.removeItem("active_chat_id");
      sessionStorage.removeItem("active_chat_name");
    }
  }, [activeChatId, activeChatName]);

  // =========================
  // LOGOUT
  // =========================
  function logout() {
    sessionStorage.clear();
    setActiveChatId(null);
    setActiveChatName("");
    setLoggedIn(false);
  }

  return (
    <>
      {/* 🌗 GLOBAL THEME TOGGLE */}
      <button
        onClick={() =>
          setTheme((prev) => (prev === "light" ? "dark" : "light"))
        }
        className="theme-toggle"
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>

      {/* =========================
          NOT LOGGED IN
         ========================= */}
      {!loggedIn ? (
        showRegister ? (
          <Register onRegistered={() => setShowRegister(false)} />
        ) : (
          <Login
            onLogin={() => setLoggedIn(true)}
            onShowRegister={() => setShowRegister(true)}
          />
        )
      ) : activeChatId ? (
        /* =========================
           CHAT ROOM
           ========================= */
        <ChatRoom
          chatId={activeChatId}
          chatName={activeChatName}
          onBack={() => {
            setActiveChatId(null);
            setActiveChatName("");
          }}
        />
      ) : (
        /* =========================
           HOME
           ========================= */
        <Home
          onOpenChat={(chatId, chatName = "") => {
            setActiveChatId(chatId);
            setActiveChatName(chatName);
          }}
          onLogout={logout}
        />
      )}
    </>
  );
}

export default App;
