// models/quyenHanModel.js
const mongoose = require('mongoose');

const quyenHanSchema = new mongoose.Schema({
  TenQuyen: { type: String, required: true },
  MoTa: { type: String, required: true }
});

const QuyenHan = mongoose.model('QuyenHan', quyenHanSchema, 'QuyenHan');

module.exports = QuyenHan;
