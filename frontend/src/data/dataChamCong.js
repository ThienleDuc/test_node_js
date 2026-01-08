import Attendance from "../models/Attendance";
import { getAssignmentById } from "./dataPhanCong";
import { getUserById } from "./dataNguoiDung";
import { getShiftById } from "./dataThoiGianBieu";

const rawDataChamCong = [
  ["1", "1", "08:05", "12:00", "Chưa thanh toán", "2025-11-20", ""],
  ["2", "2", "13:05", "17:10", "Đã thanh toán", "2025-11-21", ""],
  ["3", "3", "", "", "Chưa thanh toán", "2025-11-22", "Nghỉ không phép"],
  ["4", "4", "09:00", "13:15", "Đã thanh toán", "2025-11-23", ""],
  ["5", "5", "08:30", "12:30", "Chưa thanh toán", "2025-11-24", ""],
  ["6", "6", "", "16:00", "Đã thanh toán", "2025-11-25", ""],
  ["7", "7", "08:00", "12:05", "Chưa thanh toán", "2025-11-26", ""],
  ["8", "8", "", "", "Chưa thanh toán", "2025-11-27", "Ốm"],
  ["9", "9", "07:50", "11:45", "Đã thanh toán", "2025-11-28", ""],
  ["10", "10", "", "17:00", "Chưa thanh toán", "2025-11-29", ""],
  ["11", "11", "08:10", "12:00", "Chưa thanh toán", "2025-11-30", ""],
  ["12", "12", "", "", "Đã thanh toán", "2025-12-01", ""]
];

// Hàm tính giờ
export const calcHours = (start, end) => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return Number(Math.max(0, (eh + em / 60) - (sh + sm / 60)).toFixed(2));
};

// Map rawDataChamCong thành Attendance object đơn giản
export const dataChamCong = rawDataChamCong.map(row => {
  const [id, maLichNV, gioVao, gioRa, trangThai, ngayLam, ghiChu] = row;

  return new Attendance(
    id,
    maLichNV,
    gioVao,
    gioRa,
    0,            
    0,            
    trangThai,
    ngayLam,
    ghiChu
  );
});

// Filter dữ liệu cơ bản
export const getAttendanceByFilter = ({
  fromDate = "",
  toDate = "",
  trangThai = "",
  maNguoiDung = ""
} = {}) => 
  dataChamCong
    .filter(a => {
      const assignment = getAssignmentById(a._maLichNV);
      const ngayLam = assignment?.workDate;

      const effectiveToDate = toDate || fromDate; 
      const matchDate =
        (!fromDate || new Date(ngayLam) >= new Date(fromDate)) &&
        (!effectiveToDate || new Date(ngayLam) <= new Date(effectiveToDate));

      // Lọc trạng thái
      let matchStatus = true;
      if (trangThai === "Đã thanh toán") {
        matchStatus = a._trangThai === "Đã thanh toán" || a._trangThai === true;
      } else if (trangThai === "Chưa thanh toán") {
        matchStatus = a._trangThai === "Chưa thanh toán" || a._trangThai === false;
      }
      // nếu trangThai là "" thì matchStatus = true => tất cả đều lấy
      

      const a_maNguoiDung = assignment?.userId ?? null;

      const matchUser = maNguoiDung ? String(a_maNguoiDung) === String(maNguoiDung) : true;

      return matchDate && matchStatus && matchUser;
    })
    .map(a => {
      const assignment = getAssignmentById(a._maLichNV);
      const a_maNguoiDung = assignment?.userId ?? null;
      const maCa = assignment?.shiftId ?? null;
      const ngayLam = assignment?._ngayLam ?? "";

      const user = getUserById(a_maNguoiDung);
      const tenNguoiDung = user?.name ?? "";
      return {
        ...a,
        _maNguoiDung: a_maNguoiDung,
        _tenNguoiDung: tenNguoiDung,
        _maCa: maCa,
        _tenCa: getShiftById(maCa)?.name ?? "",
        _ngayLam: ngayLam
      };
    });
