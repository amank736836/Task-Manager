import { useEffect, useState } from "react";
import { API_BASE_URL } from "./App";

export const Dashboard = ({ token, user, showMessage }) => {
  const [stats, setStats] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      } else {
        showMessage(
          data.message || "Failed to fetch dashboard stats.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      showMessage("An error occurred while fetching dashboard stats.", "error");
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [token]);

  if (!stats) {
    return (
      <p
        style={{
          textAlign: "center",
          color: "#4b5563",
          fontSize: "1.125rem",
          marginTop: "40px",
        }}
      >
        Loading dashboard...
      </p>
    );
  }

  return (
    <div style={{ padding: "16px" }}>
      <h2
        style={{
          fontSize: "1.875rem",
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        Dashboard
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            "@media (min-width: 768px)": { gridTemplateColumns: "1fr 1fr" },
            "@media (min-width: 1024px)": {
              gridTemplateColumns: "1fr 1fr 1fr",
            },
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "8px",
              boxShadow:
                "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
              border: "1px solid #e5e7eb",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Total Tasks
            </h3>
            <p
              style={{ fontSize: "3rem", fontWeight: "bold", color: "#4f46e5" }}
            >
              {stats.totalTasks}
            </p>
          </div>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "8px",
              boxShadow:
                "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "16px",
              }}
            >
              Tasks by Status
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {Object.entries(stats.tasksByStatus).map(([status, count]) => (
                <li
                  key={status}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#374151",
                  }}
                >
                  <span style={{ textTransform: "capitalize" }}>{status}:</span>
                  <span style={{ fontWeight: "bold", fontSize: "1.125rem" }}>
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {user.role === "manager" && stats.allUsersStats && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "8px",
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            All Users Statistics (Manager View)
          </h3>
          {Object.entries(stats.allUsersStats).length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "24px",
              }}
            >
              <div
                style={{
                  "@media (min-width: 768px)": {
                    gridTemplateColumns: "1fr 1fr",
                  },
                }}
              >
                {Object.entries(stats.allUsersStats).map(
                  ([username, userStats]) => (
                    <div
                      key={username}
                      style={{
                        backgroundColor: "#f9fafb",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow:
                          "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
                        border: "1px solid #f3f4f6",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "12px",
                        }}
                      >
                        User: {username}
                      </h4>
                      <p style={{ color: "#4b5563", marginBottom: "8px" }}>
                        Total Tasks:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {userStats.totalTasks}
                        </span>
                      </p>
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        {Object.entries(userStats.tasksByStatus).map(
                          ([status, count]) => (
                            <li
                              key={`${username}-${status}`}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                color: "#4b5563",
                                fontSize: "0.875rem",
                              }}
                            >
                              <span style={{ textTransform: "capitalize" }}>
                                {status}:
                              </span>
                              <span style={{ fontWeight: "600" }}>{count}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#4b5563" }}>
              No user statistics available yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
