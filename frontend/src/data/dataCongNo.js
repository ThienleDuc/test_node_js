// src/data/dataCongNo.js
import Debt from "../models/Debt";

// Dữ liệu gốc raw dưới dạng mảng
// [id, loaiCongNo, doiTuong, doiTuongId, soTien, hanThanhToan, trangThai]
const rawCongNo = [
  // id, loaiCongNo, doiTuong, doiTuongId, soTien, hanThanhToan, trangThai, tenKhachHang, maNCC, maHoaDon
  ["1", "Phải thu", "Khách hàng", "1", 500000, "2025-12-31", "Chưa thanh toán", "Nguyễn Văn A", null, null],
  ["2", "Phải trả", "Nhà cung cấp", "1", 300000, "2025-12-25", "Đã thanh toán", null, "1", null],
  ["3", "Phải thu", "Khách hàng", "2", 200000, "2025-12-20", "Chưa thanh toán", "Trần Thị B", null, null],
  ["4", "Phải trả", "Nhà cung cấp", "2", 150000, "2025-12-15", "Chưa thanh toán", null, "2", null],
];

// map sang object + tạo instance Debt
export const dataCongNo = rawCongNo.map(
  ([id, loaiCongNo, doiTuong, doiTuongId, soTien, hanThanhToan, trangThai, tenKhachHangRaw, maNCCRaw, maHoaDonRaw]) => {
    let tenKhachHang = null;
    let maNCC = null;

    if (doiTuong === "Khách hàng") {
      tenKhachHang = tenKhachHangRaw || null;
    } else if (doiTuong === "Nhà cung cấp") {
      maNCC = maNCCRaw || null;
    }

    return {
      id: id.toString(),
      loaiCongNo,
      doiTuong,
      doiTuongId,
      tenKhachHang,
      maNCC,
      maHoaDon: maHoaDonRaw || null,
      soTien,
      hanThanhToan,
      trangThai,
      instance: new Debt(
        id.toString(),
        loaiCongNo,
        doiTuong,
        soTien,
        new Date(hanThanhToan),
        trangThai,
        tenKhachHang,
        maNCC,
        maHoaDonRaw || null
      )
    };
  }
);

// --- Helper ---
// Lấy theo id
export const getDebtById = (id) => dataCongNo.find(d => d.id === id);

// Lọc công nợ theo tiêu chí
export const getDebtsByFilter = ({ loaiCongNo = "", doiTuong = "", maNCC = "", trangThai = "" } = {}) => {
  const allEmpty = !loaiCongNo && !doiTuong && !maNCC && !trangThai;

  return dataCongNo
    .filter(d => {
      if (allEmpty) return true;

      const matchLoai = loaiCongNo ? d.loaiCongNo === loaiCongNo : true;
      const matchDoiTuong = doiTuong ? d.doiTuong === doiTuong : true;
      const matchNCC = maNCC ? d.maNCC === maNCC : true;
      const matchTrangThai = trangThai ? d.trangThai === trangThai : true;

      return matchLoai && matchDoiTuong && matchNCC && matchTrangThai;
    })
    .map(d => ({
      ...d,
      tenKhachHang: d.tenKhachHang || null,
      nhaCungCap: d.nhaCungCap || null
    }));
};
