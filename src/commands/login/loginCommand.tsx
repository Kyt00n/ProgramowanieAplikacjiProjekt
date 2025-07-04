import React, { useState } from "react";
import { UserService } from "../../services/UserService";

export const LoginModal: React.FC<{
  onClose: () => void;
  onLogin: (user: any) => void;
}> = ({ onClose, onLogin }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      if (!res.ok) {
        setError("Invalid credentials");
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      UserService.setLoggedInUser(data.user);
      onLogin(data.user);
      onClose();
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="taskmodal-backdrop">
      <form
        onSubmit={handleSubmit}
        className="taskmodal-form"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="taskmodal-close-btn"
        >
          ×
        </button>
        <div className="taskmodal-title">Login</div>
        <input
          required
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="taskmodal-input"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="taskmodal-input"
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit" className="taskmodal-submit-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export async function handleLogin(
  credentials: { name: string; surname: string; password: string },
  setHistory: React.Dispatch<React.SetStateAction<string[]>>
) {
  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      setHistory((prev) => [...prev, "Login failed!"]);
      return;
    }
    const data = await res.json();
    UserService.setLoggedInUser(data.user);
    setHistory((prev) => [...prev, "Login successful!"]);
  } catch {
    setHistory((prev) => [...prev, "Network error"]);
  }
}