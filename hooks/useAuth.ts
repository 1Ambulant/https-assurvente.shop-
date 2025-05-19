"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthData {
  token: string | null;
  isAuthenticated: boolean;
}

export function useAuth(redirectIfNotAuth = false): AuthData {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
    setIsAuthenticated(!!storedToken);

    if (redirectIfNotAuth && !storedToken) {
      router.push("/connexion");
    }
  }, [redirectIfNotAuth, router]);

  return { token, isAuthenticated };
}
