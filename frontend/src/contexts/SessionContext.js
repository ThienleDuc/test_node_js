import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, getUserPermissions, login as loginApi, logout as logoutApi, register as registerApi } from '../api/auth.api';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const [profileRes, permRes] = await Promise.all([getProfile(), getUserPermissions()]);
      if (profileRes.data.success) setUser(profileRes.data.user);
      else setUser(null);

      if (permRes.data.success) setPermissions(permRes.data.permissions || []);
      else setPermissions([]);
    } catch {
      setUser(null);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    const res = await loginApi(data);
    if (res.data.success) await fetchUser();
    return res;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
    setPermissions([]);
  };

  // 🔹 Register mới
  const register = async (data) => {
    const res = await registerApi(data);
    if (res.data.success) {
      // tự động login sau khi đăng ký thành công
      await fetchUser();
    }
    return res;
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <SessionContext.Provider value={{ user, permissions, login, logout, register, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
