import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type UserRole = "machine_user" | "supplier" | "vendor" | "job_seeker" | "employer";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  company?: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  loginWithPin: (pin: string) => Promise<boolean>;
  loginWithBiometric: () => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
  resetPassword: (phone: string, newPassword: string) => Promise<boolean>;
  sendOtp: (phone: string) => Promise<boolean>;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  company?: string;
}

const AuthContext = createContext<AuthState | null>(null);

const DEMO_USERS: Record<UserRole, User> = {
  machine_user: {
    id: "1",
    name: "Rajesh Patel",
    email: "rajesh@steelworks.com",
    phone: "+91 98765 43210",
    role: "machine_user",
    company: "Rajesh Steel Works",
  },
  supplier: {
    id: "2",
    name: "Amit Shah",
    email: "amit@supplierco.com",
    phone: "+91 99887 76655",
    role: "supplier",
    company: "Gujarat Steel Suppliers",
  },
  vendor: {
    id: "3",
    name: "Prakash Kumar",
    email: "prakash@vendorltd.com",
    phone: "+91 97654 32100",
    role: "vendor",
    company: "Kumar Spare Parts",
  },
  job_seeker: {
    id: "4",
    name: "Vikram Singh",
    email: "vikram@gmail.com",
    phone: "+91 98123 45678",
    role: "job_seeker",
  },
  employer: {
    id: "5",
    name: "Sai Rolotech HR",
    email: "hr@sairolotech.com",
    phone: "+91 98765 43210",
    role: "employer",
    company: "Sai Rolotech",
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(async (_email: string, _password: string, role: UserRole) => {
    await new Promise((r) => setTimeout(r, 800));
    setUser(DEMO_USERS[role]);
    setIsAuthenticated(true);
    return true;
  }, []);

  const loginWithPin = useCallback(async (_pin: string) => {
    await new Promise((r) => setTimeout(r, 500));
    setUser(DEMO_USERS.machine_user);
    setIsAuthenticated(true);
    return true;
  }, []);

  const loginWithBiometric = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 600));
    setUser(DEMO_USERS.machine_user);
    setIsAuthenticated(true);
    return true;
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    await new Promise((r) => setTimeout(r, 1000));
    setUser({
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      company: data.company,
    });
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const sendOtp = useCallback(async (_phone: string) => {
    await new Promise((r) => setTimeout(r, 500));
    return true;
  }, []);

  const verifyOtp = useCallback(async (_phone: string, _otp: string) => {
    await new Promise((r) => setTimeout(r, 500));
    return true;
  }, []);

  const resetPassword = useCallback(async (_phone: string, _newPassword: string) => {
    await new Promise((r) => setTimeout(r, 500));
    return true;
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      loginWithPin,
      loginWithBiometric,
      register,
      logout,
      sendOtp,
      verifyOtp,
      resetPassword,
    }),
    [isAuthenticated, user, login, loginWithPin, loginWithBiometric, register, logout, sendOtp, verifyOtp, resetPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
