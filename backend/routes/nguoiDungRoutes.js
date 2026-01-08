// routes/nguoiDungRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllNguoiDung,
    timKiemNguoiDung,
    createNguoiDung,
    updateNguoiDung,
    deleteNguoiDung
} = require('../controllers/nguoiDungController');

// Lấy tất cả
router.get('/', getAllNguoiDung);

// Tìm kiếm đa điều kiện
router.get('/tim-kiem', timKiemNguoiDung);

// Thêm mới
router.post('/', createNguoiDung);

// Sửa
router.put('/:id', updateNguoiDung);

// Xóa
router.delete('/:id', deleteNguoiDung);

module.exports = router;
