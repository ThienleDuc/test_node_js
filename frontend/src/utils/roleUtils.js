// src/data/roleUtils.js
import { dataVaiTro } from "../data/dataVaiTro";

/**
 * Lấy thông tin vai trò theo tên
 * @param {string} roleName - ví dụ: "Quản trị hệ thống"
 * @returns {object|null} { id, name, description } hoặc null nếu không tìm thấy
 */
export const getRoleByName = (roleName) => {
  const role = dataVaiTro.find(vt => {
    const name = vt?.name ?? vt._name ?? vt[1]; // getter name ưu tiên
    return name === roleName;
  });
  if (!role) return null;

  return {
    id: role?.id ?? role._id ?? role[0],
    name: role?.name ?? role._name ?? role[1],
    description: role?.description ?? role._description ?? role[2],
  };
};

/**
 * Kiểm tra role
 * @param {string} roleName - tên role của người dùng
 * @param {string} checkRole - role muốn kiểm tra
 * @returns {boolean}
 */
export const isRole = (roleName, checkRole) => roleName === checkRole;

/**
 * Lấy tất cả vai trò
 * @returns {Array} danh sách role dạng { id, name, description }
 */
export const getAllRoles = () => dataVaiTro.map(vt => ({
  id: vt?.id ?? vt._id ?? vt[0],
  name: vt?.name ?? vt._name ?? vt[1],
  description: vt?.description ?? vt._description ?? vt[2],
}));
