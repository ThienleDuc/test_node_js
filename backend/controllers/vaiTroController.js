// controllers/vaiTroController.js
const VaiTro = require('../models/vaiTro.model');

/**
 * Lấy tất cả vai trò
 * GET /api/vaitro
 */
const getAllVaiTro = async (req, res, next) => {
  try {
    const danhSach = await VaiTro.find()
    res.status(200).json(danhSach);
    // console.log('Danh sách vai trò', danhSach)
  } catch (error) {
    console.error('Lỗi khi lấy danh sách vai trò:', error);
    next(error);
  }
};

module.exports = {
  getAllVaiTro
};
