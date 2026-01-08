// src/data/dataHoaDon.js
import { dataNguoiDung } from "./dataNguoiDung";
import Invoice from "../models/Invoice";

const rawHoaDon = [
  ["1", "2025-01-05", "1", "Tiền mặt", 150000, "Đã thanh toán"],
  ["2", "2025-02-12", "2", "Chuyển khoản", 250000, "Đã thanh toán"],
  ["3", "2025-03-20", "4", "Thẻ ngân hàng", 100000, "Đã hủy"],
  ["4", "2025-03-25", "3", "Tiền mặt", 200000, "Đã thanh toán"],
  ["5", "2025-04-10", "4", "Chuyển khoản", 300000, "Đã thanh toán"],
];

// map sang object + tạo instance Invoice
export const dataHoaDon = rawHoaDon.map(
  ([id, date, userId, paymentMethod, totalAmount, status]) => {
    const createdBy = dataNguoiDung.find(u => u.id === userId) || null;

    return {
      id: id.toString(),
      date,
      createdBy,
      paymentMethod,
      totalAmount,
      status,
      unit: "VND",
      instance: new Invoice(id.toString(), date, createdBy, paymentMethod, totalAmount, status, "VND")
    };
  }
);

// --- Helper ---
export const getInvoiceById = (id) => dataHoaDon.find(inv => inv.id === id);

// Lọc hóa đơn theo tiêu chí: ngày, Thu ngân, phương thức, trạng thái
export const getInvoicesByFilter = ({
  date = "",
  createdById = "",
  paymentMethod = "",
  status = ""
} = {}) => {
  const allEmpty = !date && !createdById && !paymentMethod && !status;

  return dataHoaDon
    .filter(inv => {
      if (allEmpty) return true;

      const matchDate = date ? inv.date === date : true;
      const matchCreatedBy = createdById ? inv.createdBy?.id === createdById : true;
      const matchPayment = paymentMethod ? inv.paymentMethod === paymentMethod : true;
      const matchStatus = status ? inv.status === status : true;

      return matchDate && matchCreatedBy && matchPayment && matchStatus;
    })
    .map(inv => ({
      ...inv,
      createdBy: inv.createdBy || null,
      unit: inv.unit
    }));
};
