// controllers/quyenHanController.js
const QuyenHan = require('../models/quyenHan.model');

// Lấy danh sách tất cả quyền
const getAllQuyenHan = async (req, res, next) => {
  try {
    const danhSach = await QuyenHan.find(); // Lấy tất cả document
    res.status(200).json(danhSach);
  } catch (error) {
    next(error); // Chuyển sang middleware xử lý lỗi
  }
};

const searchQuyenHanByName = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        message: 'Vui lòng nhập từ khóa tìm kiếm'
      });
    }

    const quyenHanList = await QuyenHan.find({
      TenQuyen: { $regex: keyword, $options: 'i' } // i = không phân biệt hoa thường
    });

    res.json({
      total: quyenHanList.length,
      data: quyenHanList
    });
  } catch (error) {
    next(error);
  }
};

/**
 * THÊM MỚI QUYỀN HẠN
 * POST /api/quyenhan
 */
const createQuyenHan = async (req, res, next) => {
  try {
    const { TenQuyen, MoTa } = req.body;

    // Validate đơn giản
    if (!TenQuyen || !MoTa) {
      return res.status(400).json({
        message: 'TenQuyen và MoTa là bắt buộc'
      });
    }

    // Kiểm tra trùng tên quyền
    const existed = await QuyenHan.findOne({ TenQuyen });
    if (existed) {
      return res.status(409).json({
        message: 'Tên quyền đã tồn tại'
      });
    }

    const quyenHan = await QuyenHan.create({
      TenQuyen,
      MoTa
    });

    res.status(201).json({
      message: 'Thêm quyền hạn thành công',
      data: quyenHan
    });
  } catch (error) {
    next(error);
  }
};

/**
 * XEM CHI TIẾT 1 QUYỀN
 * GET /api/quyenhan/:id
 */
const getQuyenHanById = async (req, res, next) => {
  try {
    const quyenHan = await QuyenHan.findById(req.params.id);
    if (!quyenHan) {
      return res.status(404).json({ message: 'Không tìm thấy quyền' });
    }
    res.json(quyenHan);
  } catch (error) {
    next(error);
  }
};

/**
 * SỬA QUYỀN
 * PUT /api/quyenhan/:id
 */
const updateQuyenHan = async (req, res, next) => {
  try {
    const { TenQuyen, MoTa } = req.body;

    const quyenHan = await QuyenHan.findByIdAndUpdate(
      req.params.id,
      { TenQuyen, MoTa },
      { new: true, runValidators: true }
    );

    if (!quyenHan) {
      return res.status(404).json({ message: 'Không tìm thấy quyền' });
    }

    res.json(quyenHan);
  } catch (error) {
    next(error);
  }
};

/**
 * XÓA QUYỀN
 * DELETE /api/quyenhan/:id
 */
const deleteQuyenHan = async (req, res, next) => {
  try {
    const quyenHan = await QuyenHan.findByIdAndDelete(req.params.id);

    if (!quyenHan) {
      return res.status(404).json({ message: 'Không tìm thấy quyền' });
    }

    res.json({ message: 'Xóa quyền thành công' });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
    getAllQuyenHan, 
    searchQuyenHanByName, 
    createQuyenHan, 
    getQuyenHanById, 
    updateQuyenHan, 
    deleteQuyenHan 
};

