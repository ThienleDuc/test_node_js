const express = require('express');
const router = express.Router();

const requireLogin = require('../middlewares/authMiddleware');
const {
  loginController,
  logoutController,
  profileController,
  getUserPermissions,
  registerController // 🔹 import thêm
} = require('../controllers/authController');

// Test root
router.get('/', (req, res) => {
  res.json({ message: 'Auth API running' });
});

// Đăng ký
router.post('/register', registerController);

// Đăng nhập / Đăng xuất / Profile
router.post('/login', loginController);
router.post('/logout', logoutController);
router.get('/profile', requireLogin, profileController);

// Lấy quyền hiện tại của người dùng
router.get('/permissions', requireLogin, getUserPermissions); // 🔹 sửa lại tên thống nhất

module.exports = router;
