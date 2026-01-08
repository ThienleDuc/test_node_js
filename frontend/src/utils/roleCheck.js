// src/utils/roleCheck.js
import { isRole as isRoleUtil } from "./roleUtils";

/**
 * Kiểm tra role của user
 * @param {string} userRole - role của user
 * @returns {object} - các flag boolean
 */
export const getRoleFlags = (userRole) => ({
  isQuanTriHeThong: isRoleUtil(userRole, "Quản trị hệ thống"),
  isQuanLyCuaHang: isRoleUtil(userRole, "Quản lý cửa hàng"),
  isNhanVienKho: isRoleUtil(userRole, "Nhân viên kho"),
  isNhanVienThuNgan: isRoleUtil(userRole, "Nhân viên thu ngân"),
});
