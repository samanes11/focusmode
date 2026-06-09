"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { apiLogin, apiRegister, type ApiUser } from "@/lib/api";
import { toast } from "sonner";

interface AuthContextValue {
  user: ApiUser | null;
  loading: boolean;
  login: (userName: string, password: string) => Promise<boolean>;
  register: (userName: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY = "coffee_focus_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (userName: string, password: string) => {
    const data = await apiLogin(userName, password);
    if (data.success && data.user) {
      setUser(data.user);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      toast.success("خوش اومدی! ☕");
      return true;
    }
    toast.error(data.msg ?? "خطا در ورود");
    return false;
  }, []);

  const register = useCallback(async (userName: string, password: string) => {
    const data = await apiRegister(userName, password);
    if (data.success) {
      toast.success("ثبت‌نام موفق! حالا وارد شو");
      return true;
    }
    toast.error(data.msg ?? "خطا در ثبت‌نام");
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    toast.info("خداحافظ!");
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
