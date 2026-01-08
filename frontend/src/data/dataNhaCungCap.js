// src/data/dataNhaCungCap.js
// Dữ liệu gốc
const rawNhaCungCap = [
  ["1", "Công ty ABC", "123 Đường A, Quận 1", "0123456789", "2025-01-05"],
  ["2", "Công ty XYZ", "456 Đường B, Quận 2", "0987654321", "2025-02-02"],
  ["3", "Công ty 123", "789 Đường C, Quận 3", "0912345678", "2025-03-10"],
  ["4", "Nhà cung cấp Hòa", "12 Đường D, Quận 4", "0909123456", "2025-03-20"],
  ["5", "Công ty Minh", "34 Đường E, Quận 5", "0934567890", "2025-04-01"],
  ["6", "Công ty Nam", "56 Đường F, Quận 6", "0945678901", "2025-04-10"],
  ["7", "Công ty Lan", "78 Đường G, Quận 7", "0956789012", "2025-04-15"],
  ["8", "Công ty Hùng", "90 Đường H, Quận 8", "0967890123", "2025-04-18"],
  ["9", "Công ty Hoa", "11 Đường I, Quận 9", "0978901234", "2025-04-20"],
  ["10", "Công ty Phát", "22 Đường J, Quận 10", "0989012345", "2025-04-22"]
];

// Map sang object
export const dataNhaCungCap = rawNhaCungCap.map(
  ([id, name, address, phone, createdAt]) => ({
    id: id.toString(),
    name,
    address,
    phone,
    createdAt
  })
);

// --- Helper ---
export const getSupplierById = (id) =>
  dataNhaCungCap.find(s => s.id === id);

// Filter chỉ trả về tên
export const getSuppliersByFilter = ({ name = "" } = {}) => {
  const safeName = name.trim().toLowerCase();

  return dataNhaCungCap
    .filter(s => (safeName ? s.name.toLowerCase().includes(safeName) : true))
    .map(s => s.name); // Chỉ trả về name
};

// Lấy tất cả
export const getAllSuppliers = () => [...dataNhaCungCap];
