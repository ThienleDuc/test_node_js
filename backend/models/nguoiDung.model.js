// models/nguoiDung.model.js
const mongoose = require('mongoose');

const nguoiDungSchema = new mongoose.Schema({
  _id: {
    type: String, // Mã người dùng dạng string
    required: true
  },
  HoTen: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  MatKhau: {
    type: String,
    required: true
  },
  TrangThai: {
    type: Boolean,
    required: true,
    default: true
  },
  NgayTao: {
    type: Date,
    default: Date.now
  },
  MaVaiTro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VaiTro', // Liên kết đến collection VaiTro
    required: true
  },
  AnhDaiDien: {
    type: String,
    default: ''
  }
});

// Tạo model
const NguoiDung = mongoose.model('NguoiDung', nguoiDungSchema, "NguoiDung");

module.exports = NguoiDung;
