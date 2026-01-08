
// src/models/Debt.js
export default class Debt {
  constructor(
    id,                // ObjectId
    loaiCongNo,        // String
    doiTuong,          // String
    soTien,            // Double
    hanThanhToan,      // Date
    trangThai,         // String
    tenKhachHang = null, // String
    maNCC = null,        // String
    maHoaDon = null      // String
  ) {
    this._id = id;
    this._loaiCongNo = loaiCongNo;
    this._doiTuong = doiTuong;
    this._soTien = soTien;
    this._hanThanhToan = hanThanhToan;
    this._trangThai = trangThai;
    this._tenKhachHang = tenKhachHang;
    this._maNCC = maNCC;
    this._maHoaDon = maHoaDon;
  }

  // ===== Getter =====
  get id() { return this._id; }
  get loaiCongNo() { return this._loaiCongNo; }
  get doiTuong() { return this._doiTuong; }
  get soTien() { return this._soTien; }
  get hanThanhToan() { return this._hanThanhToan; }
  get trangThai() { return this._trangThai; }
  get tenKhachHang() { return this._tenKhachHang; }
  get maNCC() { return this._maNCC; }
  get maHoaDon() { return this._maHoaDon; }

  // ===== Setter =====
  set loaiCongNo(value) { this._loaiCongNo = value; }
  set doiTuong(value) { this._doiTuong = value; }
  set soTien(value) { this._soTien = value; }
  set hanThanhToan(value) { this._hanThanhToan = value; }
  set trangThai(value) { this._trangThai = value; }
  set tenKhachHang(value) { this._tenKhachHang = value; }
  set maNCC(value) { this._maNCC = value; }
  set maHoaDon(value) { this._maHoaDon = value; }
}