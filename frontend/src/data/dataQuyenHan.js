// src/data/dataQuyenHan.js

const rawQuyenHan = [
  ["1",  "Xem người dùng",        "Cho phép xem danh sách người dùng"],
  ["2",  "Tạo tài khoản",         "Cho phép tạo tài khoản mới"],
  ["3",  "Xóa tài khoản",         "Cho phép xóa tài khoản"],
  ["4",  "Cập nhật quyền",        "Cho phép thay đổi quyền của người dùng"],
  ["5",  "Xem báo cáo",           "Cho phép xem báo cáo doanh thu"],
  ["6",  "Thêm sản phẩm",         "Cho phép thêm sản phẩm mới"],
  ["7",  "Xóa sản phẩm",          "Cho phép xóa sản phẩm"],
  ["8",  "Cập nhật sản phẩm",     "Cho phép chỉnh sửa thông tin sản phẩm"],
  ["9",  "Xem kho",               "Cho phép xem tồn kho"],
  ["10", "Quản lý đơn hàng",      "Cho phép quản lý đơn hàng"],
  ["11", "Xem khách hàng",        "Cho phép xem thông tin khách hàng"],
];

// Map sang object kiểu dataNguoiDung
export const dataQuyenHan = rawQuyenHan.map(
  ([id, name, description]) => {
    return {
      id: id.toString(),
      name,
      description
    };
  }
);

// --- Helper ---
export const getPermissionById = (id) => dataQuyenHan.find(p => p.id === id);

export const getAllPermissions = () => dataQuyenHan.map(p => ({ ...p }));

export const getPermissionFilter = (keyword) =>
  dataQuyenHan.filter(p =>
    p.name.toLowerCase().includes(keyword.toLowerCase()) ||
    p.description.toLowerCase().includes(keyword.toLowerCase())
  );
