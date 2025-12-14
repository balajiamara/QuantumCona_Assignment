import { useEffect, useState } from "react";
import { apiRequest } from "./api";

export default function Home({ onOpenChat }) {
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

  // 🔍 ALL GROUPS FROM DB
  async function loadExplore() {
    try {
      const res = await apiRequest("/chat/explore/");
      setExploreGroups(res.groups || []);
    } catch (err) {
      console.error("Failed to load explore groups", err);
    }
  }

  // 👥 USER JOINED GROUPS
  async function loadMyGroups() {
    try {
      const res = await apiRequest("/chat/list/");
      setMyGroups(res.chats || []);
    } catch (err) {
      console.error("Failed to load my groups", err);
    }
  }

  // ➕ JOIN GROUP
  async function joinGroup(chatId) {
    try {
      await apiRequest(`/chat/${chatId}/add/`, {
        method: "POST",
      });

      // refresh lists
      await loadAll();
    } catch (err) {
      console.error("Join group failed", err);
    }
  }

  // 🧠 helper: already joined group IDs
  const joinedIds = new Set(myGroups.map(g => g.chat_id));

  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      {/* ---------------- EXPLORE GROUPS ---------------- */}
      <h2>Explore Groups</h2>

      {loading && <p>Loading...</p>}

      {!loading &&
        exploreGroups.filter(g => !joinedIds.has(g.chat_id)).length === 0 && (
          <p>No new groups to explore</p>
        )}

      {!loading &&
        exploreGroups
          .filter(g => !joinedIds.has(g.chat_id))
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

      {/* ---------------- MY GROUPS ---------------- */}
      <h2>My Groups</h2>

      {myGroups.length === 0 && (
        <p>You didn’t join any groups yet</p>
      )}

      {myGroups.map(group => (
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
          <b>{group.name || "Group Chat"}</b>
          <br />
          <small>Chat ID: {group.chat_id}</small>
        </div>
      ))}
    </div>
  );
}
