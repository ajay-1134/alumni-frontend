import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({});
  const [activeTab, setActiveTab] = useState("personal");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users/all");
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`/users/delete/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: user.phone || "",
      gender: user.gender || "",
      date_of_birth: user.date_of_birth?.split("T")[0] || "",
      profile_picture: user.profile_picture || "",
      degree: user.degree || "",
      major: user.major || "",
      current_company: user.current_company || "",
      job_title: user.job_title || "",
      industry: user.industry || "",
      linkedin_url: user.linkedin_url || "",
      website: user.website || "",
      city: user.city || "",
      state: user.state || "",
      country: user.country || "",
      role: user.role || "user",
    });
    setActiveTab("personal");
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`/users/update/${editingUser.id}`, form);
      setEditingUser(null);
      fetchUsers();
      alert("User updated successfully!");
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Update failed!");
    }
  };

  // ✅ Filtering
  const filteredUsers = users.filter((u) => {
    const first = (u.first_name || "").toLowerCase();
    const last = (u.last_name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const company = (u.current_company || "").toLowerCase();
    const job = (u.job_title || "").toLowerCase();

    return (
      first.includes(search.toLowerCase()) ||
      last.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      company.includes(search.toLowerCase()) ||
      job.includes(search.toLowerCase())
    );
  });

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-lg">Manage all users of the portal</p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by name, email, company, or job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-1/3 shadow-sm focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
          <h2 className="text-xl font-semibold mb-4">User List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 border">S.No</th>
                  <th className="p-3 border">First Name</th>
                  <th className="p-3 border">Last Name</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Company</th>
                  <th className="p-3 border">Job Title</th>
                  <th className="p-3 border">Role</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, index) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{u.first_name || "-"}</td>
                    <td className="p-3 border">{u.last_name || "-"}</td>
                    <td className="p-3 border">{u.email || "-"}</td>
                    <td className="p-3 border">{u.current_company || "-"}</td>
                    <td className="p-3 border">{u.job_title || "-"}</td>
                    <td className="p-3 border">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          u.role === "admin"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 border space-x-2">
                      <button
                        onClick={() => handleEditClick(u)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-6 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Editing */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 max-w-3xl rounded-xl shadow-lg p-6 relative">
            <h2 className="text-2xl font-bold mb-4">
              Edit User: {editingUser.first_name} {editingUser.last_name}
            </h2>

            {/* Tabs */}
            <div className="flex space-x-4 border-b mb-4">
              {[
                "personal",
                "education",
                "work",
                "socials",
                "location",
                "role",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-3 font-medium ${
                    activeTab === tab
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-2 gap-4">
              {activeTab === "personal" && (
                <>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    placeholder="First Name"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    placeholder="Last Name"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Phone"
                    className="border p-2 rounded"
                  />
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="border p-2 rounded"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) =>
                      setForm({ ...form, date_of_birth: e.target.value })
                    }
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={form.profile_picture}
                    onChange={(e) =>
                      setForm({ ...form, profile_picture: e.target.value })
                    }
                    placeholder="Profile Picture URL"
                    className="border p-2 rounded"
                  />
                </>
              )}

              {activeTab === "education" && (
                <>
                  <input
                    type="text"
                    value={form.degree}
                    onChange={(e) => setForm({ ...form, degree: e.target.value })}
                    placeholder="Degree"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={form.major}
                    onChange={(e) => setForm({ ...form, major: e.target.value })}
                    placeholder="Major"
                    className="border p-2 rounded"
                  />
                </>
              )}

              {activeTab === "work" && (
                <>
                  <input
                    type="text"
                    value={form.current_company}
                    onChange={(e) =>
                      setForm({ ...form, current_company: e.target.value })
                    }
                    placeholder="Company"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={form.job_title}
                    onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                    placeholder="Job Title"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    placeholder="Industry"
                    className="border p-2 rounded"
                  />
                </>
              )}

              {activeTab === "socials" && (
                <>
                  <input
                    type="text"
                    value={form.linkedin_url}
                    onChange={(e) =>
                      setForm({ ...form, linkedin_url: e.target.value })
                    }
                    placeholder="LinkedIn URL"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="Website"
                    className="border p-2 rounded"
                  />
                </>
              )}

              {activeTab === "location" && (
                <>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="City"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    placeholder="State"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder="Country"
                    className="border p-2 rounded"
                  />
                </>
              )}

              {activeTab === "role" && (
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="border p-2 rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
