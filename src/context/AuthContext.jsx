import React, { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch user using JWT token from localStorage
  const fetchUser = async () => {
    try {
      const res = await axios.get("/users/me"); // axios adds Bearer token
      setUser(res.data);
      return res.data;
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token"); // remove JWT
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
