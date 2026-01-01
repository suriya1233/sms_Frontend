import { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

async function loginRequest(username, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Login failed");
  }

  return res.json();
}

function LoginPage() {
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const data = await loginRequest(username, password);
      // Persist token for later API calls
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("role", data.role);
      if (data.name) {
        localStorage.setItem("name", data.name);
      }
      if (data.studentId) {
        localStorage.setItem("studentId", data.studentId);
      }

      if (data.role === "ADMIN") {
        navigate("/admin-Page");
      } else if (data.role === "STUDENT") {
        navigate("/student-Page");
      } else {
        setError("Unknown role returned from server");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2></h2>
        <p className="subtitle">Student Management System</p>

        <div className="role-switch">
          <button
            className={role === "student" ? "active" : ""}
            onClick={() => setRole("student")}
          >
            Student
          </button>
          <button
            className={role === "admin" ? "active" : ""}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="demo">
          <p><strong></strong></p>
          <p></p>
          <p></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
