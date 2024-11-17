import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/api.js";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [villainName, setVillainName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await register({ username, password, villainName });
      setSuccess("Registration successful! You can now log in.");
      setTimeout(() => navigate("/login"), 2000); // Redirect after success
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label>Villain Name:</label>
        <input
          type="text"
          value={villainName}
          onChange={(e) => setVillainName(e.target.value)}
        />
      </div>
      <button type="submit">Register</button>
      <p>
        Already have an account?{" "}
        <button type="button" onClick={() => navigate("/login")}>
          Login here
        </button>
      </p>
    </form>
  );
};

export default Register;
