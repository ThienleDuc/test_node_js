// src/data/dataChiTietPhieuNhap.js
import { dataSanPham } from "./dataSanPham";
import PurchaseDetail from "../models/PurchaseDetail";

const rawChiTietPhieuNhap = [
  ["1", "1", 50, 3000],
  ["1", "2", 30, 18000],
  ["1", "1", 20, 3000],
  ["2", "3", 10, 12000],
  ["3", "2", 25, 18000],
  ["3", "3", 40, 12000],
];

export const dataChiTietPhieuNhap = rawChiTietPhieuNhap.map(
  ([maPN, maSP, soLuong, donGia]) => {
    const sanPham = dataSanPham.find(sp => sp._id === maSP || sp[0] === maSP);
    const tenSP = sanPham ? (sanPham._name ?? sanPham[1]) : "Không xác định";
    
    return new PurchaseDetail(maPN, maSP, tenSP, soLuong, donGia);
  }
);

// --- Helper ---
export const getPurchaseDetailByPN = (maPN, maSP) =>
  dataChiTietPhieuNhap.filter(d => {
    const matchPN = d._purchaseId === maPN;
    const matchSP = maSP ? d._productId === maSP : true;
    return matchPN && matchSP;
  });

export const getPurchaseDetailFilter = ({ maPN = "", productName = "" }) =>
  dataChiTietPhieuNhap.filter(d => {
    const matchPN = maPN ? String(d._purchaseId) === String(maPN) : true;
    const matchProductName = productName
      ? d._productName.toLowerCase().includes(productName.toLowerCase())
      : true;
    return matchPN && matchProductName;
  });
