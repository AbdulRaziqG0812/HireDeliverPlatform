import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const savedUser = localStorage.getItem("hireDeliverUser");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("hireDeliverLoggedIn");
    localStorage.removeItem("hireDeliverUser");

    navigate("/");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
        padding: "30px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "45px",
          borderRadius: "16px",
          textAlign: "center",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1>Admin Dashboard</h1>

        <p style={{ marginTop: "15px", color: "#555" }}>
          Admin login successful.
        </p>

        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            background: "#f8f9fc",
            borderRadius: "10px",
            textAlign: "left",
          }}
        >
          <p>
            <strong>Name:</strong>{" "}
            {user?.fullName || "Administrator"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {user?.email || "N/A"}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            {user?.role || "N/A"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "25px",
            padding: "12px 25px",
            border: "none",
            borderRadius: "8px",
            background: "#172033",
            color: "#ffffff",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          Logout
        </button>
      </div>
    </main>
  );
}

export default AdminDashboard;