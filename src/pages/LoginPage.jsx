import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import GoogleButton from "../components/GoogleButton";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", form);

      // ✅ Save JWT to localStorage
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // ✅ Fetch user profile
      const user = await fetchUser();

      // ✅ Redirect by role
      if (user?.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert("Invalid credentials");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/auth/google/login";
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/src/logo.png" // place logo in public/logo.png
            alt="Alumni Portal Logo"
            className="w-16 h-16 mb-2"
          />
          <h1 className="text-2xl font-bold text-gray-800">Alumni Portal</h1>
          <p className="text-gray-500 text-sm">Welcome back! Please login.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Login */}
        <GoogleButton text="Login with Google" onClick={handleGoogleLogin} />

        {/* Link to Register */}
        <p className="text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
