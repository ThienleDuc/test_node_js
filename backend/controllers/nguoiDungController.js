// controllers/nguoiDungController.js
const NguoiDung = require('../models/nguoiDung.model');
const VaiTro = require('../models/vaiTro.model'); 

const bcrypt = require('bcrypt');

// --- Lấy tất cả người dùng ---
const getAllNguoiDung = async (req, res, next) => {
  try {
    // Lấy tất cả người dùng và populate tên vai trò
    const danhSach = await NguoiDung.find()
      .populate('MaVaiTro', 'TenVaiTro') 
      .lean(); 

    // Trả về object
    res.status(200).json({
      data: danhSach.map(u => ({
        ...u,
        TenVaiTro: u.MaVaiTro?.TenVaiTro || "",
        TrangThaiLabel: u.TrangThai ? "Hoạt động" : "Khóa"
      })),
      total: danhSach.length,
      message: "Lấy danh sách thành công"
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    next(error);
  }
};

// --- Tìm kiếm đa điều kiện ---s
const timKiemNguoiDung = async (req, res, next) => {
  try {
    const { HoTen, MaVaiTro, TrangThai } = req.query;
    let filter = {};

    if (HoTen) {
      filter.HoTen = { $regex: HoTen, $options: 'i' };
    }
    if (MaVaiTro) {
      filter.MaVaiTro = MaVaiTro;
    }
    if (TrangThai !== undefined) {
      filter.TrangThai = TrangThai === 'true';
    }

    const ketQua = await NguoiDung.find(filter).populate('MaVaiTro', 'TenVaiTro MoTa');
    res.status(200).json(ketQua);
  } catch (error) {
    next(error);
  }
};

const createNguoiDung = async (req, res, next) => {
  try {
    let { _id, HoTen, Email, MatKhau, TrangThai, MaVaiTro, AnhDaiDien } = req.body;

    // -------- VALIDATE DỮ LIỆU ĐẦU VÀO --------
    if (
      typeof HoTen !== "string" || HoTen.trim().length === 0 ||
      typeof Email !== "string" || Email.trim().length === 0 ||
      typeof MatKhau !== "string" || MatKhau.trim().length === 0 ||
      typeof MaVaiTro !== "string" || MaVaiTro.trim().length === 0
    ) {
      return res.status(400).json({
        message: "HoTen, Email, MatKhau, MaVaiTro không được để trống"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return res.status(400).json({
        message: "Email không đúng định dạng"
      });
    }

    if (MatKhau.length < 6) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 6 ký tự"
      });
    }

    const vaiTro = await VaiTro.findById(MaVaiTro);
    if (!vaiTro) {
      return res.status(400).json({
        message: "Vai trò không tồn tại"
      });
    }

    // Kiểm tra trùng email
    const existed = await NguoiDung.findOne({ Email });
    if (existed) {
      return res.status(409).json({ message: 'Email đã tồn tại' });
    }

    // Tự sinh _id nếu chưa có
    if (!_id) {
      // Lấy document vai trò theo MaVaiTro
      const vaiTro = await VaiTro.findById(MaVaiTro);

      if (!vaiTro) {
        return res.status(400).json({
          message: "Vai trò không tồn tại"
        });
      }

      // Xác định prefix dựa trên TenVaiTro
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
          return res.status(400).json({
            message: "Tên vai trò chưa định nghĩa prefix"
          });
      }

      // Lấy danh sách người dùng cùng prefix để sinh số thứ tự tiếp theo
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
    }


    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(MatKhau, 10);

    const nguoiDung = await NguoiDung.create({
      _id,
      HoTen,
      Email,
      MatKhau: hashedPassword,
      TrangThai: TrangThai !== undefined ? TrangThai : true,
      MaVaiTro,
      AnhDaiDien: AnhDaiDien || ''
    });

    res.status(201).json({
      message: 'Thêm người dùng thành công',
      data: nguoiDung
    });

  } catch (error) {
    next(error);
  }
};

// --- Sửa người dùng ---
const updateNguoiDung = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // --- Validator ---
    const allowedFields = ["HoTen", "Email", "MatKhau", "TrangThai", "MaVaiTro", "AnhDaiDien"];
    const invalidFields = Object.keys(updateData).filter(f => !allowedFields.includes(f));
    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Các trường không hợp lệ: ${invalidFields.join(", ")}`
      });
    }

    if (updateData.Email) {
      // Kiểm tra email hợp lệ
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.Email)) {
        return res.status(400).json({ message: "Email không hợp lệ" });
      }

      // Kiểm tra email trùng (ngoại trừ bản thân người dùng)
      const existed = await NguoiDung.findOne({ Email: updateData.Email, _id: { $ne: id } });
      if (existed) {
        return res.status(409).json({ message: "Email đã tồn tại" });
      }
    }

    if (updateData.MaVaiTro) {
      // Kiểm tra vai trò tồn tại
      const roleExists = await VaiTro.findById(updateData.MaVaiTro);
      if (!roleExists) {
        return res.status(400).json({ message: "Vai trò không tồn tại" });
      }
    }

    if (updateData.TrangThai !== undefined && typeof updateData.TrangThai !== "boolean") {
      return res.status(400).json({ message: "TrangThai phải là boolean" });
    }

    // --- Nếu có mật khẩu mới, mã hóa ---
    if (updateData.MatKhau) {
      updateData.MatKhau = await bcrypt.hash(updateData.MatKhau, 10);
    }

    const nguoiDung = await NguoiDung.findByIdAndUpdate(id, updateData, { new: true });
    if (!nguoiDung) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.status(200).json({
      message: "Cập nhật người dùng thành công",
      data: nguoiDung
    });
  } catch (error) {
    next(error);
  }
};

// --- Xóa người dùng ---
const deleteNguoiDung = async (req, res, next) => {
  try {
    const { id } = req.params;

    const nguoiDung = await NguoiDung.findByIdAndDelete(id);
    if (!nguoiDung) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    res.status(200).json({
      message: 'Xóa người dùng thành công',
      data: nguoiDung
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllNguoiDung,
  timKiemNguoiDung,
  createNguoiDung,
  updateNguoiDung,
  deleteNguoiDung
};
