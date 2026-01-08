// src/data/dataThoiGianBieu.js
import Shift from "../models/Shift";

// --- RAW DATA DƯỚI DẠNG MẢNG ---
const rawThoiGianBieu = [
  ["1", "Ca sáng",  "08:00", "12:00", "4", 30000, 120000, "2025-01-01", "Hoạt động", ""],
  ["2", "Ca chiều", "13:00", "17:00", "4", 30000, 120000, "2025-01-01", "Hoạt động", ""],
  ["3", "Ca tối",   "18:00", "22:00", "4", 35000, 140000, "2025-01-01", "Hoạt động", "Ca bận rộn"],
];

// --- MAP SANG OBJECT + TẠO INSTANCE ---
export const dataThoiGianBieu = rawThoiGianBieu.map(
  ([id, name, start, end, soGio, donGia, tongTien, ngayTao, trangThai, ghiChu]) => ({
    id: id.toString(),
    name,
    startTime: start,
    endTime: end,
    soGio,
    donGia,
    tongTien,
    ngayTao,
    trangThai,
    ghiChu,
    instance: new Shift(
      id.toString(),
      name,
      start,
      end,
      soGio,
      donGia,
      tongTien,
      ngayTao,
      trangThai,
      ghiChu
    )
  })
);

// --- FILTER THEO TÊN CA & TRẠNG THÁI ---
export const getShiftsByFilter = ({ name = "", trangThai = "" } = {}) => {
  const safeName = name.trim().toLowerCase();
  const safeTrangThai = trangThai.trim().toLowerCase();

  return dataThoiGianBieu.filter(c => {
    const matchName = !safeName || c.name.toLowerCase().includes(safeName);
    const matchTrangThai = !safeTrangThai || c.trangThai.toLowerCase().includes(safeTrangThai);
    return matchName && matchTrangThai;
  }).map(c => ({
    ...c,
    instance: c.instance
  }));
};

// --- GET BY ID ---
export const getShiftById = (id) => {
  if (!id) return null;
  return dataThoiGianBieu.find(c => c.id === id);
};
