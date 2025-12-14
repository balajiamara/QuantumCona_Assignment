import { useEffect, useState } from "react";
import { apiRequest } from "./api";

export default function Home({ onOpenChat }) {
  const [activeTab, setActiveTab] = useState("groups"); // groups | users
  const [exploreGroups, setExploreGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    await Promise.all([loadExplore(), loadMyGroups()]);
    setLoading(false);
  }

  // 🔍 ALL GROUPS
  async function loadExplore() {
    try {
      const res = await apiRequest("/chat/explore/");
      setExploreGroups(res.groups || []);
    } catch (err) {
      console.error("Explore groups failed", err);
    }
  }

  // 👥 USER JOINED GROUPS
  async function loadMyGroups() {
    try {
      const res = await apiRequest("/chat/list/");
      setMyGroups(res.chats || []);
    } catch (err) {
      console.error("My groups failed", err);
    }
  }

  // ➕ JOIN GROUP
  async function joinGroup(chatId) {
    try {
      await apiRequest(`/chat/${chatId}/add/`, { method: "POST" });
      await loadAll();
    } catch (err) {
      console.error("Join group failed", err);
    }
  }

  // already joined
  const joinedIds = new Set(myGroups.map((g) => g.chat_id));

  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      {/* ----------- TAB SWITCH ----------- */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setActiveTab("groups")}>
          Group Chats
        </button>{" "}
        <button onClick={() => setActiveTab("users")}>
          One-to-One Chat
        </button>
      </div>

      {/* ================= GROUP CHATS ================= */}
      {activeTab === "groups" && (
        <>
          <h2>Explore Groups</h2>

          {loading && <p>Loading...</p>}

          {!loading &&
            exploreGroups.filter((g) => !joinedIds.has(g.chat_id))
              .length === 0 && <p>No new groups to explore</p>}

          {!loading &&
            exploreGroups
              .filter((g) => !joinedIds.has(g.chat_id))
              .map((g) => (
                <div
                  key={g.chat_id}
                  style={{
                    border: "1px solid #ccc",
                    padding: 10,
                    marginBottom: 8,
                  }}
                >
                  <b>{g.name || "Group Chat"}</b>
                  <br />
                  <small>Chat ID: {g.chat_id}</small>
                  <br />
                  <button onClick={() => joinGroup(g.chat_id)}>
                    Join
                  </button>
                </div>
              ))}

          <hr />

          <h2>My Groups</h2>

          {myGroups.length === 0 && (
            <p>You didn’t join any groups yet</p>
          )}

          {myGroups.map((group) => (
            <div
              key={group.chat_id}
              style={{
                border: "1px solid #ccc",
                padding: 10,
                marginBottom: 8,
                cursor: "pointer",
              }}
              onClick={() => onOpenChat(group.chat_id)}
            >
              <b>{group.is_group ? "Group Chat" : "Private Chat"}</b>
              <br />
              <small>Chat ID: {group.chat_id}</small>
            </div>
          ))}
        </>
      )}

      {/* ================= ONE-TO-ONE ================= */}
      {activeTab === "users" && (
  <>
    <h2>One-to-One Chat</h2>
    <p>No users available yet</p>
  </>
)}

    </div>
  );
}
