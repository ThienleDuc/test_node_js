// src/utils/auth.js
import { dataNguoiDung } from "../data/dataNguoiDung";

/**
 * Hàm kiểm tra login (tích hợp fakeLogin + auth)
 * @param {string} email 
 * @param {string} password
 * @returns {object} { success, message, user }
 */
export function handleLogin(email, password) {
  if (!email || !password) {
    return {
      success: false,
      message: "Vui lòng nhập đầy đủ email và mật khẩu",
      user: null,
    };
  }

  // ---- LOGIN (fake database) ----
  const user = dataNguoiDung.find(u =>
    u.email.trim() === email.trim().toLowerCase() &&
    u._password.trim() === password.trim() 
  );

  if (!user) {
    return {
      success: false,
      message: "Email hoặc mật khẩu không đúng",
      user: null
    };
  }

  // ---- KIỂM TRA TRẠNG THÁI ----
  if (user.status !== "Hoạt động") {
    return {
      success: false,
      message: "Tài khoản đã bị khóa",
      user: null
    };
  }

  // ---- TẠO OBJECT USER TRẢ VỀ ----
  const userObj = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role?.name || "",      // role có thể là object hoặc string
    status: user.status,
    avatar: user.avatar || "" // avatar theo getter
  };

  return {
    success: true,
    message: "Đăng nhập thành công",
    user: userObj
  };
}
