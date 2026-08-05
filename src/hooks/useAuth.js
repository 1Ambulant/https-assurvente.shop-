import { useState, useEffect, useCallback } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("fm_user");
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (telephone, password, role = "client") => {
    const mockUser = { id: "u1", telephone, role, name: "Utilisateur" };
    localStorage.setItem("fm_user", JSON.stringify(mockUser));
    localStorage.setItem("fm_token", "beta-token-" + Date.now());
    setUser(mockUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("fm_user");
    localStorage.removeItem("fm_token");
    setUser(null);
  }, []);

  const hasRole = useCallback((roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  return { user, loading, login, logout, hasRole };
}