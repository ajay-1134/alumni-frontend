import { useState } from "react";
import api from "../api/axios";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/register", formData);
      alert("✅ Registered successfully! Please login.");
      window.location.href = "/login";
    } catch (err) {
      alert("❌ Registration failed: " + err.response?.data?.error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form onSubmit={handleRegister} className="space-y-3">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
          <button className="w-full bg-green-500 text-white py-2 rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
