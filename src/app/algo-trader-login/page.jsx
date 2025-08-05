"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signIn("credentials", {
            username,
            password,
            callbackUrl: "/algo-trader",
          });
        }}
        style={{
          background: "#fff",
          padding: "1.5rem",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          minWidth: 280,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          textAlign: "center",
        }}
      >
        <h5 style={{ margin: 0, marginBottom: "1rem", fontWeight: "normal" }}>
          Algo Trading Manager
        </h5>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc" }}
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc" }}
          required
          autoComplete="current-password"
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem",
            borderRadius: 4,
            border: "none",
            backgroundColor: "#0070f3",
            color: "white",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
