// middlewares/authMiddleware.js
const { isAuthenticated } = require('../contexts/sessionContext');

const requireLogin = (req, res, next) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      success: false,
      message: 'Bạn chưa đăng nhập'
    });
  }
  next();
};

module.exports = requireLogin;
