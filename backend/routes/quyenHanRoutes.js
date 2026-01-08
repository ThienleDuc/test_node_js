// routes/quyenHanRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getAllQuyenHan, 
    getQuyenHanById,
    updateQuyenHan,
    deleteQuyenHan,
    searchQuyenHanByName,
    createQuyenHan
} = require('../controllers/quyenHanController');

// Route GET /api/quyenhan
router.get('/', getAllQuyenHan);

// 🔍 Tìm kiếm
router.get('/search', searchQuyenHanByName);

// ➕ Thêm mới
router.post('/', createQuyenHan);

// Xem chi tiết
router.get('/:id', getQuyenHanById);

// Sửa
router.put('/:id', updateQuyenHan);

// Xóa
router.delete('/:id', deleteQuyenHan);

module.exports = router;
