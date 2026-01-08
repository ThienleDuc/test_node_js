
// src/models/QuyenHan.js
export default class QuyenHan {
  /**
   * @param {import('mongodb').ObjectId|string} id  // _id có thể là ObjectId hoặc string (tùy lúc khởi tạo)
   * @param {string} TenQuyen
   * @param {string} MoTa
   */
  constructor(id, TenQuyen, MoTa) {
    this._id = id;          // ObjectId
    this._TenQuyen = TenQuyen; // String
    this._MoTa = MoTa;         // String
  }

  // --- Getter ---
  get id() { return this._id; }
  get TenQuyen() { return this._TenQuyen; }
  get MoTa() { return this._MoTa; }

  // --- Setter ---
  set TenQuyen(value) { this._TenQuyen = value; }
  set MoTa(value) { this._MoTa = value; }
}