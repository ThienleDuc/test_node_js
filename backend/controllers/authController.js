// controllers/authController.js
const NguoiDung = require('../models/nguoiDung.model');
const VaiTro = require('../models/vaiTro.model');

const bcrypt = require('bcrypt');
const sessionContext = require('../contexts/sessionContext');

const loginController = async (req, res) => {
  const { Email, MatKhau } = req.body;

  // Tìm user và populate vai trò
  const user = await NguoiDung.findOne({ Email }).populate('MaVaiTro');
  // console.log("User found:", user); // Log ra console để kiểm tra

  if (!user) {
    return res.status(401).json({ message: 'Email không tồn tại' });
  }

  const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);
  if (!isMatch) {
    return res.status(401).json({ message: 'Mật khẩu không đúng' });
  }

  if (!user.TrangThai) {
    return res.status(403).json({ message: 'Tài khoản bị khóa' });
  }

  // Lưu session
  sessionContext.login(req, user);

  // Trả về user + TenVaiTro
  res.json({
    success: true,
    user: sessionContext.getUser(req)
  });
};

const logoutController = async (req, res) => {
  await sessionContext.logout(req);

  res.json({
    success: true,
    message: 'Đăng xuất thành công'
  });
};

const profileController = (req, res) => {
  res.json({
    success: true,
    user: sessionContext.getUser(req)
  });
};

const getUserPermissions = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });

    const maVaiTro = user.MaVaiTro?._id || user.MaVaiTro;
    if (!maVaiTro) return res.status(400).json({ success: false, message: 'User không có vai trò' });

    // Populate chỉ lấy TenQuyen, tránh lấy toàn bộ object
    const vaiTro = await VaiTro.findById(maVaiTro).populate('QuyenHan', 'TenQuyen');
    if (!vaiTro) return res.status(404).json({ success: false, message: 'Không tìm thấy vai trò' });

    // Lấy mảng tên quyền, filter null/undefined
    const permissions = (vaiTro.QuyenHan || []).map(qh => qh?.TenQuyen).filter(Boolean);

    res.json({ success: true, permissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// controllers/authController.js
const registerController = async (req, res) => {
  const { Email, MatKhau, TenVaiTro, HoTen } = req.body;

  try {
    // 🔹 Kiểm tra email tồn tại
    const existingUser = await NguoiDung.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email đã tồn tại" });
    }

    // 🔹 Lấy vai trò từ TenVaiTro
    const vaiTro = await VaiTro.findOne({ TenVaiTro });
    if (!vaiTro) {
      return res.status(404).json({ success: false, message: "Không tìm thấy vai trò" });
    }

    // 🔹 Sinh _id theo prefix dựa trên vai trò
    let _id;
    let prefix;
    switch (vaiTro.TenVaiTro) {
      case "Quản trị hệ thống":
        prefix = "QTHT";
        break;
      case "Thu ngân":
        prefix = "TN";
        break;
      case "Kho":
        prefix = "KHO";
        break;
      case "Quản lý cửa hàng":
        prefix = "QLCH";
        break;
      default:
        return res.status(400).json({ success: false, message: "Tên vai trò chưa định nghĩa prefix" });
    }

    // Lấy người dùng cùng prefix để sinh số thứ tự tiếp theo
    const usersWithPrefix = await NguoiDung.find({ _id: { $regex: `^${prefix}` } })
      .sort({ _id: -1 })
      .limit(1);

    let nextNumber = 1;
    if (usersWithPrefix.length > 0) {
      const lastId = usersWithPrefix[0]._id;
      const match = lastId.match(/\d+$/);
      if (match) nextNumber = parseInt(match[0], 10) + 1;
    }

    _id = `${prefix}${String(nextNumber).padStart(2, '0')}`; // VD: QTHT01

    // 🔹 Hash mật khẩu
    const hashedPassword = await bcrypt.hash(MatKhau, 10);

    // 🔹 Tạo user mới
    const newUser = await NguoiDung.create({
      _id,
      HoTen: HoTen || "Người dùng",
      Email,
      MatKhau: hashedPassword,
      MaVaiTro: vaiTro._id,
      TrangThai: true
    });

    // 🔹 Trả về thông tin cơ bản
    res.json({
      success: true,
      message: "Đăng ký thành công",
      user: {
        id: newUser._id,
        Email: newUser.Email,
        TenVaiTro: vaiTro.TenVaiTro
      }
    });

  } catch (err) {
    console.error("Lỗi khi đăng ký:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

module.exports = {
  profileController,
  loginController,
  logoutController,
  getUserPermissions,
  registerController
};