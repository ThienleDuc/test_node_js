// contexts/sessionContext.js

/**
 * Lưu thông tin người dùng vào session (đăng nhập)
 * @param {Object} req - request (express)
 * @param {Object} nguoiDung - document NguoiDung từ MongoDB
 */
const login = (req, nguoiDung) => {
  // Nếu MaVaiTro đã được populate
  const tenVaiTro = nguoiDung.MaVaiTro?.TenVaiTro || "";

  req.session.user = {
    _id: nguoiDung._id,
    HoTen: nguoiDung.HoTen,
    Email: nguoiDung.Email,
    MaVaiTro: nguoiDung.MaVaiTro,
    TenVaiTro: tenVaiTro,
    AnhDaiDien: nguoiDung.AnhDaiDien
  };
};

/**
 * Xóa session người dùng (đăng xuất)
 * @param {Object} req - request (express)
 */
const logout = (req) => {
  return new Promise((resolve, reject) => {
    req.session.destroy(err => {
      if (err) reject(err);
      resolve(true);
    });
  });
};

/**
 * Lấy thông tin user từ session
 * @param {Object} req
 * @returns {Object|null}
 */
const getUser = (req) => {
  return req.session?.user || null;
};

/**
 * Kiểm tra đã đăng nhập hay chưa
 * @param {Object} req
 * @returns {Boolean}
 */
const isAuthenticated = (req) => {
  return !!req.session?.user;
};

module.exports = {
  login,
  logout,
  getUser,
  isAuthenticated
};
