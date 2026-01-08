// src/data/dataSanPham.js
import Product from "../models/Product";
import { getSupplierById } from "./dataNhaCungCap";

// Dữ liệu sản phẩm gốc dưới dạng mảng "raw"
const rawSanPham = [
  ["1", "Nước suối Lavie 500ml", 3000, 5000, 120, "Chai", true, "2025-11-01", "1", null],
  ["2", "Sữa tươi Vinamilk 1L", 18000, 22000, 60, "Hộp", true, "2025-11-02",  "2", null],
  ["3", "Bánh quy Oreo 137g", 12000, 15000, 40, "Hộp", true, "2025-11-03",    "3", null],
  ["4", "Snack Lays 50g", 7000, 10000, 80, "Gói", true, "2025-11-04",         "4", null],
  ["5", "Kẹo mút Chupa Chups", 2000, 5000, 150, "Cái", true, "2025-11-05",    "5", null],
  ["6", "Nước ngọt Coca Cola 330ml", 8000, 12000, 100, "Lon", true, "2025-11-06", "1", null],
  ["7", "Mì tôm Hảo Hảo", 4000, 6000, 200, "Gói", true, "2025-11-07",         "2", null],
  ["8", "Trà xanh C2 350ml", 5000, 8000, 90, "Chai", true, "2025-11-08",      "3", null],
  ["9", "Bánh mì sandwich", 15000, 20000, 30, "Cái", true, "2025-11-09",      "4", null],
  ["10", "Sữa chua Vinamilk 100g", 4000, 6000, 70, "Hộp", true, "2025-11-10", "5", null]
];

// Map sang instance Product
export const dataSanPham = rawSanPham.map(
  ([id, name, cost, price, quantity, unit, active, createdAt, id_supplier, image]) => {
    return new Product(id, name, cost, price, quantity, unit, active, createdAt, id_supplier, image || null);
  }
);

// --- Helper ---
export const getProductById = (id) => dataSanPham.find(p => p.id === id);

// --- Filter theo tên sản phẩm, tên nhà cung cấp, trạng thái ---
export const getProductsByFilter = ({ name = "", supplierName = "", status = "" } = {}) => {
  const allEmpty = !name && !supplierName && !status;
  return dataSanPham
    .filter(p => {
      if (allEmpty) return true;

      const matchName = name ? p.name.toLowerCase().includes(name.toLowerCase()) : true;
      const matchSupplier = supplierName
        ? (getSupplierById(p._supplierId)?.name || "").toLowerCase().includes(supplierName.toLowerCase())
        : true;
      const matchStatus = status
        ? (p.active ? "Hoạt động" : "Khóa") === status
        : true;

      return matchName && matchSupplier && matchStatus;
    })
    .map(p => ({  
      id: p.id,
      name: p.name,
      cost: p.cost,
      price: p.price,
      quantity: p.quantity,
      unit: p.unit,
      active: p.active ? "Hoạt động" : "Khóa",
      createdAt: p.createdAt,
      supplierName: getSupplierById(p._supplierId)?.name || "",
      image: p.image
    }));
};
