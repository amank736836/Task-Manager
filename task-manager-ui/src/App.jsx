import { useEffect, useState } from 'react';
import { Dashboard } from './Dashboard';
import { TaskManagement } from './TaskManagement';
import { AuthForm } from './AuthForm';

export const API_BASE_URL = "https://task-manager-b8rc.onrender.com";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [view, setView] = useState("login");
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      setView("tasks");
    }
  }, [token]);

  const showMessage = (msg, type = "info") => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setIsLoggedIn(false);
    setUser(null);
    setView("login");
    showMessage("Logged out successfully!", "success");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 0",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
          padding: "32px",
        }}
      >
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: "bold",
            textAlign: "center",
            color: "#1f2937",
            marginBottom: "32px",
          }}
        >
          Task Manager
        </h1>

        {message && (
          <div
            style={{
              backgroundColor: "#dbeafe",
              border: "1px solid #93c5fd",
              color: "#1e40af",
              padding: "12px 16px",
              borderRadius: "4px",
              position: "relative",
              marginBottom: "16px",
            }}
            role="alert"
          >
            <span style={{ display: "block" }}>{message}</span>
          </div>
        )}

        {isLoggedIn ? (
          <>
            <nav
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                marginBottom: "32px",
              }}
            >
              <button
                onClick={() => setView("tasks")}
                style={{
                  padding: "12px 24px",
                  borderRadius: "9999px",
                  fontWeight: "600",
                  transition:
                    "background-color 0.2s, color 0.2s, box-shadow 0.2s",
                  backgroundColor: view === "tasks" ? "#4f46e5" : "#e5e7eb",
                  color: view === "tasks" ? "#fff" : "#374151",
                  boxShadow:
                    view === "tasks"
                      ? "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"
                      : "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                My Tasks
              </button>
              <button
                onClick={() => setView("dashboard")}
                style={{
                  padding: "12px 24px",
                  borderRadius: "9999px",
                  fontWeight: "600",
                  transition:
                    "background-color 0.2s, color 0.2s, box-shadow 0.2s",
                  backgroundColor: view === "dashboard" ? "#4f46e5" : "#e5e7eb",
                  color: view === "dashboard" ? "#fff" : "#374151",
                  boxShadow:
                    view === "dashboard"
                      ? "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"
                      : "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: "12px 24px",
                  borderRadius: "9999px",
                  fontWeight: "600",
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  transition: "background-color 0.2s, box-shadow 0.2s",
                  boxShadow:
                    "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Logout ({user?.username})
              </button>
            </nav>

            {view === "tasks" && (
              <TaskManagement
                token={token}
                user={user}
                showMessage={showMessage}
              />
            )}
            {view === "dashboard" && (
              <Dashboard token={token} user={user} showMessage={showMessage} />
            )}
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <button
              onClick={() => setView("login")}
              style={{
                padding: "12px 24px",
                borderRadius: "9999px",
                fontWeight: "600",
                transition:
                  "background-color 0.2s, color 0.2s, box-shadow 0.2s",
                backgroundColor: view === "login" ? "#4f46e5" : "#e5e7eb",
                color: view === "login" ? "#fff" : "#374151",
                boxShadow:
                  view === "login"
                    ? "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"
                    : "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Login
            </button>
            <button
              onClick={() => setView("register")}
              style={{
                padding: "12px 24px",
                borderRadius: "9999px",
                fontWeight: "600",
                transition:
                  "background-color 0.2s, color 0.2s, box-shadow 0.2s",
                backgroundColor: view === "register" ? "#4f46e5" : "#e5e7eb",
                color: view === "register" ? "#fff" : "#374151",
                boxShadow:
                  view === "register"
                    ? "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"
                    : "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Register
            </button>
          </div>
        )}

        {!isLoggedIn && view === "login" && (
          <AuthForm
            type="login"
            onAuthSuccess={(userData, userToken) => {
              setToken(userToken);
              setUser(userData);
              setIsLoggedIn(true);
              localStorage.setItem("token", userToken);
              setView("tasks");
              showMessage("Logged in successfully!", "success");
            }}
            showMessage={showMessage}
          />
        )}
        {!isLoggedIn && view === "register" && (
          <AuthForm
            type="register"
            onAuthSuccess={(userData, userToken) => {
              setToken(userToken);
              setUser(userData);
              setIsLoggedIn(true);
              localStorage.setItem("token", userToken);
              setView("tasks");
              showMessage(
                "Registration successful! Logged in automatically.",
                "success"
              );
            }}
            showMessage={showMessage}
          />
        )}
      </div>
    </div>
  );
};

export default App;
