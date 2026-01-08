
// src/models/ChamCong.js
export default class Attendance {
  constructor(
    id,           // ObjectId
    maLichNV,     // ObjectId
    gioVao,       // String
    gioRa,        // String
    tongGioLam,   // Double
    tienThucLanh, // Double
    trangThai,    // Bool
    ngayCapNhat,  // Date
    ghiChu        // String
  ) {
    this._id = id;
    this._maLichNV = maLichNV;
    this._gioVao = gioVao;
    this._gioRa = gioRa;
    this._tongGioLam = tongGioLam;
    this._tienThucLanh = tienThucLanh;
    this._trangThai = trangThai;
    this._ngayCapNhat = ngayCapNhat;
    this._ghiChu = ghiChu;
  }

  // ===== Getter =====
  get id() { return this._id; }
  get maLichNV() { return this._maLichNV; }
  get gioVao() { return this._gioVao; }
  get gioRa() { return this._gioRa; }
  get tongGioLam() { return this._tongGioLam; }
  get tienThucLanh() { return this._tienThucLanh; }
  get trangThai() { return this._trangThai; }
  get ngayCapNhat() { return this._ngayCapNhat; }
  get ghiChu() { return this._ghiChu; }

  // ===== Setter =====
  set maLichNV(value) { this._maLichNV = value; }
  set gioVao(value) { this._gioVao = value; }
  set gioRa(value) { this._gioRa = value; }
  set tongGioLam(value) { this._tongGioLam = value; }
  set tienThucLanh(value) { this._tienThucLanh = value; }
  set trangThai(value) { this._trangThai = value; }
  set ngayCapNhat(value) { this._ngayCapNhat = value; }
  set ghiChu(value) { this._ghiChu = value; }
}
