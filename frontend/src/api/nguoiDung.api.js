// api/nguoiDung.api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/nguoi-dung"; 
// đổi port hoặc path nếu backend của bạn khác

// --- Lấy tất cả người dùng ---
export const getAllNguoiDung = () => {
  return axios.get(API_URL).then(res => res.data);
};

// --- Tìm kiếm người dùng theo tên, vai trò, trạng thái ---
export const searchNguoiDung = (params) => {
  // params có thể là: { HoTen, MaVaiTro, TrangThai }
  return axios.get(`${API_URL}/tim-kiem`, { params }).then(res => res.data);
};

// --- Thêm mới người dùng ---
export const createNguoiDung = (data) => {
  return axios.post(API_URL, data).then(res => res.data);
};

// --- Sửa người dùng ---
export const updateNguoiDung = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data).then(res => res.data);
};

// --- Xóa người dùng ---
export const deleteNguoiDung = (id) => {
  return axios.delete(`${API_URL}/${id}`).then(res => res.data);
};
