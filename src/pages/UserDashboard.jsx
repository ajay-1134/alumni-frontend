// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  // ✅ Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get("/users/me");
      setUser(res.data);

      // ✅ Only whitelist allowed fields from UpdateUserRequest
      setForm({
        first_name: res.data.first_name || "",
        last_name: res.data.last_name || "",
        phone: res.data.phone || "",
        gender: res.data.gender || "",
        date_of_birth: res.data.date_of_birth
          ? res.data.date_of_birth.split("T")[0]
          : "",
        profile_picture: res.data.profile_picture || "",
        enrollment_year: res.data.enrollment_year || "",
        graduation_year: res.data.graduation_year || "",
        degree: res.data.degree || "",
        major: res.data.major || "",
        roll_number: res.data.roll_number || "",
        current_company: res.data.current_company || "",
        job_title: res.data.job_title || "",
        industry: res.data.industry || "",
        linkedin_url: res.data.linkedin_url || "",
        website: res.data.website || "",
        city: res.data.city || "",
        state: res.data.state || "",
        country: res.data.country || "",
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Update user
  const handleUpdate = async () => {
    try {
      const payload = {
        ...form,
        enrollment_year: form.enrollment_year
          ? parseInt(form.enrollment_year, 10)
          : 0,
        graduation_year: form.graduation_year
          ? parseInt(form.graduation_year, 10)
          : 0,
      };
      console.log(payload)
      await axios.patch("/users/update/me", payload);
      setIsEditing(false);
      fetchProfile();
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Update failed!");
    }
  };

  // ✅ Delete user
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      await axios.delete("/users/delete/me");
      alert("Your account has been deleted.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      console.error("Failed to delete profile:", err);
      alert("Delete failed!");
    }
  };

  if (!user) return <div className="p-6">Loading profile...</div>;

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg mb-6 text-center">
          <img
            src={user.profile_picture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-md"
          />
          <h1 className="text-3xl font-bold mt-4">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-indigo-100">{user.email}</p>
          <span className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-semibold">
            {user.role}
          </span>
        </div>

        {/* Profile Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">Personal Info</h2>
            <p><strong>Phone:</strong> {user.phone || "-"}</p>
            <p><strong>Gender:</strong> {user.gender || "-"}</p>
            <p><strong>DOB:</strong> {user.date_of_birth?.split("T")[0] || "-"}</p>
            <p>
              <strong>Location:</strong> {user.city}, {user.state}, {user.country}
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">Education</h2>
            <p><strong>Degree:</strong> {user.degree || "-"}</p>
            <p><strong>Major:</strong> {user.major || "-"}</p>
            <p><strong>Enrollment Year:</strong> {user.enrollment_year || "-"}</p>
            <p><strong>Graduation Year:</strong> {user.graduation_year || "-"}</p>
            <p><strong>Roll No:</strong> {user.roll_number || "-"}</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">Work</h2>
            <p><strong>Company:</strong> {user.current_company || "-"}</p>
            <p><strong>Job Title:</strong> {user.job_title || "-"}</p>
            <p><strong>Industry:</strong> {user.industry || "-"}</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">Social</h2>
            <p><strong>LinkedIn:</strong> {user.linkedin_url || "-"}</p>
            <p><strong>Website:</strong> {user.website || "-"}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Edit Profile
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Profile
          </button>
        </div>
      </div>

      {/* Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 max-w-3xl rounded-xl shadow-lg p-6 relative">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

            {/* Tabs */}
            <div className="flex space-x-4 border-b mb-4">
              {["personal", "education", "work", "socials", "location"].map((tab) => (
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
                    placeholder="First Name"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
                    placeholder="Profile Picture URL"
                    value={form.profile_picture}
                    onChange={(e) =>
                      setForm({ ...form, profile_picture: e.target.value })
                    }
                    className="border p-2 rounded"
                  />
                </>
              )}

              {activeTab === "education" && (
                <>
                  <input
                    type="number"
                    placeholder="Enrollment Year"
                    value={form.enrollment_year}
                    onChange={(e) =>
                      setForm({ ...form, enrollment_year: e.target.value })
                    }
                    className="border p-2 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Graduation Year"
                    value={form.graduation_year}
                    onChange={(e) =>
                      setForm({ ...form, graduation_year: e.target.value })
                    }
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Degree"
                    value={form.degree}
                    onChange={(e) => setForm({ ...form, degree: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Major"
                    value={form.major}
                    onChange={(e) => setForm({ ...form, major: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Roll Number"
                    value={form.roll_number}
                    onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
                    className="border p-2 rounded"
                  />
                </>
              )}

              {activeTab === "work" && (
                <>
                  <input
                    type="text"
                    placeholder="Company"
                    value={form.current_company}
                    onChange={(e) =>
                      setForm({ ...form, current_company: e.target.value })
                    }
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={form.job_title}
                    onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Industry"
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    className="border p-2 rounded"
                  />
                </>
              )}

              {activeTab === "socials" && (
                <>
                  <input
                    type="text"
                    placeholder="LinkedIn URL"
                    value={form.linkedin_url}
                    onChange={(e) =>
                      setForm({ ...form, linkedin_url: e.target.value })
                    }
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Website"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="border p-2 rounded"
                  />
                </>
              )}

              {activeTab === "location" && (
                <>
                  <input
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="border p-2 rounded"
                  />
                </>
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
                onClick={() => setIsEditing(false)}
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

export default UserDashboard;
