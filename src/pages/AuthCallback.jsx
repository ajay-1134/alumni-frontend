import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AuthCallback = () => {
  const { fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      // Get token from query string
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        localStorage.setItem("token", token); // save like normal login
      }

      const user = await fetchUser();
      if (user) {
        if (user.role === "admin") navigate("/admin", { replace: true });
        else navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    };
    handleAuth();
  }, [fetchUser, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <p className="text-lg text-gray-700">Signing you in with Google...</p>
    </div>
  );
};

export default AuthCallback;
