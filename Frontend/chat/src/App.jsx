import { useState } from "react";
import Login from "./Login";
import Chat from "./Chat";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!sessionStorage.getItem("access_token")
  );

  return loggedIn ? <Chat /> : <Login onLogin={() => setLoggedIn(true)} />;
}
