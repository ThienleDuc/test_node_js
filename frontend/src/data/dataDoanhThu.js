// src/data/dataDoanhThu.js
import Revenue from "../models/Revenue";
import { dataSanPham } from "./dataSanPham";
import { dataNguoiDung } from "./dataNguoiDung";

// Giả lập hóa đơn: mỗi người dùng mua 1-3 sản phẩm
const rawDoanhThu = [];

dataNguoiDung.forEach(user => {
  // Giả lập 1-2 hóa đơn mỗi người dùng
  const numInvoices = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < numInvoices; i++) {
    const invoiceId = `HD${user.id}${i + 1}`;
    const invoiceDate = `2025-11-${(i + 1).toString().padStart(2, "0")}`;

    // Chọn 1-3 sản phẩm khác nhau
    const numProducts = Math.floor(Math.random() * 3) + 1;
    const selectedProducts = [...dataSanPham].sort(() => 0.5 - Math.random()).slice(0, numProducts);

    selectedProducts.forEach(sp => {
      const quantity = Math.floor(Math.random() * 5) + 1;
      const unitPrice = sp.price;
      const totalPrice = quantity * unitPrice;

      rawDoanhThu.push([
        invoiceId,
        invoiceDate,
        user.id,
        user.name,
        sp.id,
        sp.name,
        quantity,
        unitPrice,
        totalPrice
      ]);
    });
  }
});

// Map sang object + instance Revenue
export const dataDoanhThu = rawDoanhThu.map(
  ([invoiceId, invoiceDate, userId, userName, productId, productName, quantity, unitPrice, totalPrice]) => ({
    invoiceId,
    invoiceDate,
    userId,
    userName,
    productId,
    productName,
    quantity,
    unitPrice,
    totalPrice,
    instance: new Revenue(invoiceId, invoiceDate, userId, userName, productId, productName, quantity, unitPrice, totalPrice)
  })
);

// --- Helper ---
export const getRevenueByInvoiceId = (id) =>
  dataDoanhThu.filter(r => r.invoiceId === id);

export const getRevenueByFilter = ({ fromDate = "", toDate = "", productId = "", userId = "" } = {}) => {
  return dataDoanhThu.filter(r => {
    const matchProduct = productId ? r.productId === productId : true;
    const matchUser = userId ? r.userId === userId : true;
    const matchFromDate = fromDate ? r.invoiceDate >= fromDate : true;
    const matchToDate = toDate ? r.invoiceDate <= toDate : true;
    return matchProduct && matchUser && matchFromDate && matchToDate;
  });
};
