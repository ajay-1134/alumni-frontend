import { useState } from "react";
import api from "../api/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/login", { email, password });
      // save token
      localStorage.setItem("token", res.data.token);
      // redirect
      window.location.href = "/dashboard";
    } catch (err) {
      // full error logging
      console.error("Login error:", err);

      if (err.response && err.response.data) {
        // backend returned an error JSON
        const errorMessage =
          err.response.data.error || err.response.data.message || "Login failed";
        alert("❌ " + errorMessage);
      } else if (err.request) {
        // request made but no response
        alert("❌ No response from server. Is backend running?");
      } else {
        // something else went wrong
        alert("❌ Error: " + err.message);
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/auth/google/login";
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-500 text-white py-2 rounded">
            Login
          </button>
        </form>
        <hr className="my-4" />
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
