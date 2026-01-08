// src/data/dataChiTietHoaDon.js
import { dataSanPham } from "./dataSanPham";
import InvoiceDetail from "../models/InvoiceDetail";

// Dữ liệu thô giữ nguyên
const rawChiTietHoaDon = [
  ["1", "1", 10, 5000, 50000],
  ["1", "2", 5, 22000, 110000],
  ["2", "1", 20, 5000, 100000],
  ["2", "3", 10, 15000, 150000],
];

// Chuyển thành đối tượng InvoiceDetail
export const dataChiTietHoaDon = rawChiTietHoaDon.map(
  ([maHD, maSP, soLuong, donGia, thanhTien]) => {
    const sp = dataSanPham.find(s => s._id === maSP || s[0] === maSP);
    const tenSP = sp ? (sp._name ?? sp[1]) : "Không xác định";

    return new InvoiceDetail(maHD, maSP, tenSP, soLuong, donGia, thanhTien);
  }
);

// --- Helper ---
export const getInvoiceDetailByHD = (maHD, maSP) =>
  dataChiTietHoaDon.filter(d => {
    const matchHD = d._invoiceId === maHD;
    const matchSP = maSP ? d._productId === maSP : true;
    return matchHD && matchSP;
  });

export const getInvoiceDetailFilter = ({ maHD = "", productName = "" }) =>
  dataChiTietHoaDon.filter(d => {
    const matchHD = maHD ? String(d._invoiceId) === String(maHD) : true;
    const matchProductName = productName
      ? d._productName.toLowerCase().includes(productName.toLowerCase())
      : true;
    return matchHD && matchProductName;
  });
