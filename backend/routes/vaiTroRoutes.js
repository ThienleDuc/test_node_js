// routes/vaiTroRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getAllVaiTro
} = require('../controllers/vaiTroController');

// Lấy tất cả vai trò
router.get('/', getAllVaiTro);

module.exports = router;
