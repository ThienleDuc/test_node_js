// src/data/dataVaiTro.js
const rawVaiTro = [
  ["1", "Quản trị hệ thống", "Quản lý toàn bộ hệ thống"],
  ["2", "Quản lý cửa hàng", "Quản lý cửa hàng riêng"],
  ["3", "Nhân viên thu ngân", "Quản lý thu chi tại cửa hàng"],
  ["4", "Nhân viên kho", "Quản lý kho hàng"]
];

// map sang object
export const dataVaiTro = rawVaiTro.map(([id, name, description]) => ({
  id: id.toString(),
  name,
  description
}));

// lấy theo filter nếu cần
export const getRolesByFilter = ({ name = "" } = {}) => {
  const safeName = name.trim().toLowerCase();
  return dataVaiTro.filter(r =>
    !safeName || r.name.toLowerCase().includes(safeName)
  );
};

// lấy role theo id
export const getRoleById = (id) => {
  if (!id) return null;
  return dataVaiTro.find(r => r.id === id);
};
