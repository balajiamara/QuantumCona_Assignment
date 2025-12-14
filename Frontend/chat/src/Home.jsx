import { useEffect, useState } from "react";
import { apiRequest } from "./api";

export default function Home({ onOpenChat }) {
  const [exploreGroups, setExploreGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    await Promise.all([loadExplore(), loadMyGroups()]);
  }

  // 🔍 ALL GROUPS FROM DB
  async function loadExplore() {
    const res = await apiRequest("/chat/explore/");
    setExploreGroups(res.groups || []);
  }

  // 👥 USER JOINED GROUPS
  async function loadMyGroups() {
    const res = await apiRequest("/chat/list/");
    setMyGroups(res.chats || []);
  }

  // ➕ JOIN GROUP
  async function joinGroup(chatId) {
    await apiRequest(`/chat/${chatId}/add/`, { method: "POST" });
    await loadAll(); // 🔥 refresh both sections
  }

  // helper: check membership
  const joinedIds = new Set(myGroups.map(g => g.chat_id));

  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      {/* ---------------- EXPLORE GROUPS ---------------- */}
      <h2>Explore Groups</h2>

      {exploreGroups.length === 0 && <p>No groups available</p>}

      {exploreGroups.map(group => (
        <div
          key={group.chat_id}
          style={{ border: "1px solid #ccc", padding: 10, marginBottom: 5 }}
        >
          <b>{group.name || "Group Chat"}</b>

          {!joinedIds.has(group.chat_id) && (
            <button
              style={{ marginLeft: 10 }}
              onClick={() => joinGroup(group.chat_id)}
            >
              Join
            </button>
          )}
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
          style={{ border: "1px solid #ccc", padding: 10, marginBottom: 5 }}
          onClick={() => onOpenChat(group.chat_id)}
        >
          <b>Group Chat</b>
          <br />
          <small>Chat ID: {group.chat_id}</small>
        </div>
      ))}
    </div>
  );
}
