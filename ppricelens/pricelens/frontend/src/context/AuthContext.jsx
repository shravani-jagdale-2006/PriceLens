import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'register'

  useEffect(() => {
    async function loadUser() {
      try {
        const storedUser = localStorage.getItem("pricelens_user");
        const token = localStorage.getItem("pricelens_token");
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        } else {
          // Preload Alex Morgan demo account for effortless testing out of the box
          const demoAccount = {
            id: "usr-demo-001",
            email: "demo@pricelens.com",
            name: "Alex Morgan"
          };
          setUser(demoAccount);
          localStorage.setItem("pricelens_user", JSON.stringify(demoAccount));
        }
      } catch (err) {
        console.error("Auth load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      localStorage.setItem("pricelens_token", data.token);
      localStorage.setItem("pricelens_user", JSON.stringify(data.user));
      setIsAuthModalOpen(false);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await api.register(name, email, password);
      setUser(data.user);
      localStorage.setItem("pricelens_token", data.token);
      localStorage.setItem("pricelens_user", JSON.stringify(data.user));
      setIsAuthModalOpen(false);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pricelens_token");
    localStorage.removeItem("pricelens_user");
  };

  const openAuthModal = (mode = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        setAuthMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
