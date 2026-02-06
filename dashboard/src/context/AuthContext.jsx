// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Check localStorage so we don't get logged out on refresh
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('insight_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    // 🎭 FAKE AUTH: Hardcoded credentials for the demo
    if (email === "admin@insight.com" && password === "admin") {
      const fakeUser = { 
        name: "Admin User", 
        email: email, 
        role: "admin",
        avatar: "https://ui-avatars.com/api/?name=Admin+User"
      };
      setUser(fakeUser);
      localStorage.setItem('insight_user', JSON.stringify(fakeUser));
      return { success: true };
    } 
    
    return { success: false, message: "Invalid credentials (Try: admin@insight.com / admin)" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('insight_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);