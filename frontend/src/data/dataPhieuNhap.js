import Receipt from "../models/Receipt";
import { dataNhaCungCap } from "./dataNhaCungCap";
import { dataNguoiDung } from "./dataNguoiDung";

// Dữ liệu gốc raw dưới dạng mảng
const rawPhieuNhap = [
  ["1", "2025-01-05", "1", "1", 150000],
  ["2", "2025-02-12", "2", "1", 250000],
  ["3", "2025-03-20", "1", "1", 100000],
  ["4", "2025-03-25", "3", "1", 200000],
  ["5", "2025-04-10", "2", "1", 300000],
  ["6", "2025-04-15", "1", "1", 180000],
  ["7", "2025-05-01", "3", "1", 220000],
  ["8", "2025-05-12", "2", "1", 270000],
  ["9", "2025-05-20", "1", "1", 120000],
  ["10", "2025-06-05", "3", "1", 350000]
];

// map sang object + tạo instance Receipt (thêm unit = "VND")
export const dataPhieuNhap = rawPhieuNhap.map(
  ([id, date, supplierId, createdById, totalAmount]) => {
    const supplier = dataNhaCungCap.find(s => s.id === supplierId) || null;
    const createdBy = dataNguoiDung.find(u => u.id === createdById) || null;

    return {
      id: id.toString(),
      date,
      supplier,
      createdBy,
      totalAmount,
      unit: "VND",
      instance: new Receipt(id.toString(), date, supplier, createdBy, totalAmount, "VND")
    };
  }
);

// --- Helper ---
export const getReceiptById = (id) => dataPhieuNhap.find(r => r.id === id);


// Lọc phiếu nhập theo tiêu chí
export const getReceiptsByFilter = ({ date = "", supplierId = "", createdById = "" } = {}) => {
  const allEmpty = !date && !supplierId && !createdById;

  return dataPhieuNhap
    .filter(r => {
      if (allEmpty) return true;

      const matchDate = date ? r.date === date : true;
      const matchSupplier = supplierId ? r.supplier?.id === supplierId : true;
      const matchCreatedBy = createdById ? r.createdBy?.id === createdById : true;

      return matchDate && matchSupplier && matchCreatedBy;
    })
    .map(r => ({
      ...r,
      supplier: r.supplier || null,
      createdBy: r.createdBy || null,
      unit: r.unit
    }));
};
