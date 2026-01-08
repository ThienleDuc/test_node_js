// models/vaiTro.model.js
const mongoose = require('mongoose');

const vaiTroSchema = new mongoose.Schema({
  TenVaiTro: {
    type: String,
    required: true,
    trim: true,
  },
  MoTa: {
    type: String,
    required: true,
    trim: true,
  },
  QuyenHan: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuyenHan', // tham chiếu đến collection QuyenHan
    },
  ],
}, { timestamps: true }); // timestamps sẽ tự tạo createdAt và updatedAt

const VaiTro = mongoose.model('VaiTro', vaiTroSchema, 'VaiTro');

module.exports = VaiTro;
