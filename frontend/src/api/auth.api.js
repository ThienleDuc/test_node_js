import axios from 'axios';

// Tạo instance axios dùng chung cho auth
const authAxios = axios.create({
  baseURL: 'http://localhost:5000/api/auth', // đổi theo backend của bạn
  withCredentials: true // 🔥 BẮT BUỘC để gửi session cookie
});

/**
 * Đăng nhập
 * @param {Object} data { Email, MatKhau }
 */
export const login = (data) => {
  return authAxios.post('/login', data);
};

/**
 * Đăng ký
 * @param {Object} data { HoTen, Email, MatKhau, MaVaiTro }
 */
export const register = (data) => {
  return authAxios.post('/register', data);
};

/**
 * Đăng xuất
 */
export const logout = () => {
  return authAxios.post('/logout');
};

/**
 * Lấy thông tin người dùng đang đăng nhập (từ session)
 */
export const getProfile = () => {
  return authAxios.get('/profile');
};

/**
 * Lấy danh sách quyền của người dùng đang đăng nhập
 */
export const getUserPermissions = () => {
  return authAxios.get('/permissions'); // 🔹 sửa từ /vai-tro sang /permissions
};
