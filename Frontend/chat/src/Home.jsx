// import { useEffect, useState } from "react";
// import { apiRequest } from "./api";
// import OneToOne from "./OneToOne";

// export default function Home({ onOpenChat }) {
//   const [activeTab, setActiveTab] = useState("groups"); // groups | users
//   const [exploreGroups, setExploreGroups] = useState([]);
//   const [myGroups, setMyGroups] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (activeTab === "groups") {
//       loadAll();
//     }
//   }, [activeTab]);

//   async function loadAll() {
//     setLoading(true);
//     await Promise.all([loadExplore(), loadMyGroups()]);
//     setLoading(false);
//   }

//   // 🔍 ALL GROUPS
//   async function loadExplore() {
//     try {
//       const res = await apiRequest("/chat/explore/");
//       setExploreGroups(res.groups || []);
//     } catch (err) {
//       console.error("Explore groups failed", err);
//     }
//   }

//   // 👥 USER JOINED GROUPS
//   async function loadMyGroups() {
//     try {
//       const res = await apiRequest("/chat/list/");
//       setMyGroups(res.chats || []);
//     } catch (err) {
//       console.error("My groups failed", err);
//     }
//   }

//   // ➕ JOIN GROUP
//   async function joinGroup(chatId) {
//     try {
//       await apiRequest(`/chat/${chatId}/add/`, { method: "POST" });
//       await loadAll();
//     } catch (err) {
//       console.error("Join group failed", err);
//     }
//   }

//   const joinedIds = new Set(myGroups.map((g) => g.chat_id));

//   // ➕ CREATE GROUP
//   async function createGroup() {
//     const groupName = window.prompt("Enter group name");
//     if (!groupName || !groupName.trim()) return;

//     try {
//       const res = await apiRequest("/chat/create/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams({
//           is_group: "true",
//           name: groupName.trim(),
//         }),
//       });

//       await loadAll();

//       // ✅ PASS NAME
//       onOpenChat(res.chat_id, res.name);

//     } catch (err) {
//       console.error("Create group failed", err);
//     }
//   }

//   return (
//     <div style={{ maxWidth: 700, margin: "auto" }}>
//       {/* ----------- TAB SWITCH ----------- */}
//       <div style={{ marginBottom: 20 }}>
//         <button onClick={() => setActiveTab("groups")}>
//           Group Chats
//         </button>{" "}
//         <button onClick={() => setActiveTab("users")}>
//           One-to-One Chat
//         </button>
//       </div>

//       {activeTab === "groups" && (
//         <button
//           onClick={createGroup}
//           style={{
//             marginBottom: 15,
//             padding: "8px 12px",
//             fontWeight: "bold",
//           }}
//         >
//           ➕ Create Group
//         </button>
//       )}

//       {/* ================= GROUP CHATS ================= */}
//       {activeTab === "groups" && (
//         <>
//           <h2>Explore Groups</h2>

//           {loading && <p>Loading...</p>}

//           {!loading &&
//             exploreGroups.filter((g) => !joinedIds.has(g.chat_id)).length === 0 && (
//               <p>No new groups to explore</p>
//             )}

//           {!loading &&
//             exploreGroups
//               .filter((g) => !joinedIds.has(g.chat_id))
//               .map((g) => (
//                 <div
//                   key={g.chat_id}
//                   style={{
//                     border: "1px solid #ccc",
//                     padding: 10,
//                     marginBottom: 8,
//                   }}
//                 >
//                   <b>{g.name || "Group Chat"}</b>
//                   <br />
//                   <small>Chat ID: {g.chat_id}</small>
//                   <br />
//                   <button onClick={() => joinGroup(g.chat_id)} className="btn">
//                     Join
//                   </button>
//                 </div>
//               ))}

//           <hr />

//           <h2>My Groups</h2>

//           {myGroups.length === 0 && (
//             <p>You didn't join any groups yet</p>
//           )}

//           {myGroups.map((group) => (
//             <div
//               key={group.chat_id}
//               style={{
//                 border: "1px solid #ccc",
//                 padding: 10,
//                 marginBottom: 8,
//                 cursor: "pointer",
//               }}
//               onClick={() =>
//                 onOpenChat(group.chat_id, group.name)
//               }
//             >
//               <b>{group.name } </b> {/*  || "Group Chat"}</b> */}
//               <br />
//               <small>Chat ID: {group.chat_id}</small>
//             </div>
//           ))}
//         </>
//       )}

//       {/* ================= ONE-TO-ONE ================= */}
//       {activeTab === "users" && (
//         <OneToOne onOpenChat={onOpenChat} />
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { apiRequest } from "./api";
import OneToOne from "./OneToOne";

export default function Home({ onOpenChat, onLogout }) {
  const [activeTab, setActiveTab] = useState("groups"); // groups | users
  const [exploreGroups, setExploreGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "groups") {
      loadAll();
    }
  }, [activeTab]);

  async function loadAll() {
    setLoading(true);
    await Promise.all([loadExplore(), loadMyGroups()]);
    setLoading(false);
  }

  async function loadExplore() {
    try {
      const res = await apiRequest("/chat/explore/");
      setExploreGroups(res.groups || []);
    } catch (err) {
      console.error("Explore groups failed", err);
    }
  }

  async function loadMyGroups() {
    try {
      const res = await apiRequest("/chat/list/");
      setMyGroups(res.chats || []);
    } catch (err) {
      console.error("My groups failed", err);
    }
  }

  async function joinGroup(chatId) {
    try {
      await apiRequest(`/chat/${chatId}/add/`, { method: "POST" });
      await loadAll();
    } catch (err) {
      console.error("Join group failed", err);
    }
  }

  const joinedIds = new Set(myGroups.map((g) => g.chat_id));

  async function createGroup() {
    const groupName = window.prompt("Enter group name");
    if (!groupName || !groupName.trim()) return;

    try {
      const res = await apiRequest("/chat/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          is_group: "true",
          name: groupName.trim(),
        }),
      });

      await loadAll();
      onOpenChat(res.chat_id, res.name);
    } catch (err) {
      console.error("Create group failed", err);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      {/* 🔐 HEADER WITH LOGOUT */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 className="heading">Chats</h2>

        {/* <button className="btn-logout" onClick={onLogout}>
          Logout
        </button> */}
        <button
          className="btn-logout logout-float"
          onClick={() => {
            if (window.confirm("Are you sure you want to logout?")) {
              onLogout();
            }
          }}
        >
          Logout
        </button>

      </div>

      {/* ----------- TABS ----------- */}
      <div style={{ marginBottom: 20 }}>
        <button
          className={`tab-btn ${activeTab === "groups" ? "active" : ""}`}
          onClick={() => setActiveTab("groups")}
        >
          Group Chats
        </button>

        <button
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          One-to-One Chat
        </button>
      </div>

      {/* ----------- CREATE GROUP ----------- */}
      {activeTab === "groups" && (
        <button
          className="btn"
          onClick={createGroup}
          style={{ marginBottom: 16 }}
        >
          ➕ Create Group
        </button>
      )}

      {/* ================= GROUP CHATS ================= */}
      {activeTab === "groups" && (
        <>
          <h2 className="heading">Explore Groups</h2>

          {loading && <p>Loading...</p>}

          {!loading &&
            exploreGroups.filter((g) => !joinedIds.has(g.chat_id)).length === 0 && (
              <p>No new groups to explore</p>
            )}

          {!loading &&
            exploreGroups
              .filter((g) => !joinedIds.has(g.chat_id))
              .map((g) => (
                <div key={g.chat_id} className="group-card">
                  <b>{g.name || "Group Chat"}</b>
                  <br />
                  <small>Chat ID: {g.chat_id}</small>
                  <br />
                  <button
                    className="btn-outline"
                    onClick={() => joinGroup(g.chat_id)}
                    style={{ marginTop: 6 }}
                  >
                    Join
                  </button>
                </div>
              ))}

          <hr style={{ margin: "24px 0" }} />

          <h2 className="heading">My Groups</h2>

          {myGroups.length === 0 && (
            <p>You didn’t join any groups yet</p>
          )}

          {myGroups.map((group) => (
            <div
              key={group.chat_id}
              className="group-card"
              onClick={() => onOpenChat(group.chat_id, group.name)}
            >
              <b>{group.name}</b>
              <br />
              <small>Chat ID: {group.chat_id}</small>
            </div>
          ))}
        </>
      )}

      {/* ================= ONE-TO-ONE ================= */}
      {activeTab === "users" && (
        <OneToOne onOpenChat={onOpenChat} />
      )}
    </div>
  );
}
