import { useState } from "react";
import { API_BASE_URL } from "./App";

export const AuthForm = ({ type, onAuthSuccess, showMessage }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = type === "login" ? "login" : "register";
      const body =
        type === "login"
          ? { email, password }
          : { username, email, password, role };

      const res = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log("Response:", res);

      const data = await res.json();

      if (res.ok) {
        onAuthSuccess(data, data.token);
      } else {
        showMessage(data.message || `Failed to ${type}.`, "error");
      }
    } catch (error) {
      console.error("Auth error:", error);
      showMessage(`An error occurred during ${type}.`, "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#f9fafb",
        padding: "32px",
        borderRadius: "8px",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#374151",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        {type === "login" ? "Login" : "Register"}
      </h2>
      {type === "register" && (
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              color: "#374151",
              fontSize: "0.875rem",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            style={{
              boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
              appearance: "none",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              width: "100%",
              padding: "8px 12px",
              color: "#374151",
              lineHeight: "1.5",
              outline: "none",
            }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required={type === "register"}
          />
        </div>
      )}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            color: "#374151",
            fontSize: "0.875rem",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          style={{
            boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
            appearance: "none",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
            width: "100%",
            padding: "8px 12px",
            color: "#374151",
            lineHeight: "1.5",
            outline: "none",
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div style={{ marginBottom: "24px" }}>
        <label
          style={{
            display: "block",
            color: "#374151",
            fontSize: "0.875rem",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
          htmlFor="password"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          style={{
            boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
            appearance: "none",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
            width: "100%",
            padding: "8px 12px",
            color: "#374151",
            marginBottom: "12px",
            lineHeight: "1.5",
            outline: "none",
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {type === "register" && (
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              color: "#374151",
              fontSize: "0.875rem",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
            htmlFor="role"
          >
            Role
          </label>
          <select
            id="role"
            style={{
              boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              width: "100%",
              padding: "8px 12px",
              color: "#374151",
              lineHeight: "1.5",
              outline: "none",
            }}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
          </select>
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          type="submit"
          style={{
            backgroundColor: "#6366f1",
            color: "#fff",
            fontWeight: "bold",
            padding: "8px 24px",
            borderRadius: "9999px",
            outline: "none",
            boxShadow:
              "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
            transition: "background-color 0.2s",
            border: "none",
            cursor: "pointer",
          }}
        >
          {type === "login" ? "Sign In" : "Register"}
        </button>
      </div>
    </form>
  );
};
