// src/api/vaiTro.api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/vai-tro"; // đổi port nếu backend khác

// Lấy tất cả vai trò
export const getAllVaiTro = () => {
  return axios.get(API_URL).then(res => res);
};
