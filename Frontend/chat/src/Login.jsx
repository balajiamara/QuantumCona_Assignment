// import { useState } from "react";
// import { apiRequest } from "./api";

// export default function Login({ onLogin }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   async function handleLogin(e) {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await apiRequest("/login/", {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams({
//           Email: email,
//           Password: password,
//         }),
//       });

//       sessionStorage.setItem("access_token", res.access_token);
//       onLogin();
//     } catch (err) {
//       setError(err.error || "Login failed");
//     }
//   }

//   return (
//     <form onSubmit={handleLogin}>
//       <h2>Login</h2>

//       <input
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button type="submit">Login</button>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </form>
//   );
// }


// import { useState } from "react";
// import { apiRequest } from "./api";

// export default function Login({ onLogin }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   async function handleLogin(e) {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await apiRequest("/login/", {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams({
//           Email: email,
//           Password: password,
//         }),
//       });

//       sessionStorage.setItem("access_token", res.access_token);
//       onLogin();
//     } catch (err) {
//       setError(err.error || "Login failed");
//     }
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <form
//         onSubmit={handleLogin}
//         className="card"
//         style={{ width: 320 }}
//       >
//         <h2 className="heading">Login</h2>

//         <div style={{ marginBottom: 12 }}>
//           <input
//             className="input"
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div style={{ marginBottom: 16 }}>
//           <input
//             className="input"
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         <button type="submit" className="btn" style={{ width: "100%" }}>
//           Login
//         </button>

//         {error && (
//           <p
//             style={{
//               color: "red",
//               marginTop: 12,
//               fontSize: 14,
//               textAlign: "center",
//             }}
//           >
//             {error}
//           </p>
//         )}
//       </form>
//     </div>
//   );
// }


import { useState } from "react";
import { apiRequest } from "./api";

export default function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await apiRequest("/login/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          Email: email,
          Password: password,
        }),
      });

      sessionStorage.setItem("access_token", res.access_token);
      onLogin();
    } catch (err) {
      setError(err.error || "Login failed");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleLogin}
        className="card"
        style={{ width: 340 }}
      >
        <h2 className="heading">Login</h2>

        <div style={{ marginBottom: 12 }}>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn"
          style={{ width: "100%" }}
        >
          Login
        </button>

        {error && (
          <p
            style={{
              color: "red",
              marginTop: 12,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        {/* ✅ SWITCH TO REGISTER */}
        <p
          style={{
            marginTop: 14,
            textAlign: "center",
            fontSize: 14,
          }}
        >
          New user?{" "}
          <span
            style={{
              color: "var(--primary)",
              cursor: "pointer",
              fontWeight: 500,
            }}
            onClick={onShowRegister}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
