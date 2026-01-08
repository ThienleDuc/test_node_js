// src/data/dataPhanCong.js
import Assignment from "../models/Assignment";
import { dataNguoiDung } from "./dataNguoiDung";
import { dataThoiGianBieu } from "./dataThoiGianBieu";

// RAW DATA dưới dạng array
const rawPhanCong = [
  ["1", "7" , "1", "2025-01-05", "Đã phân công", "6", "2025-01-03 09:12:00", ""],
  ["2", "11", "2", "2025-01-05", "Hoàn thành", "6", "2025-01-03 09:15:20", "Làm tốt"],
  ["3", "2" , "3", "2025-01-06", "Vắng", "6", "2025-01-04 14:22:10", "Nghỉ không phép"],
  ["4", "4" , "1", "2025-01-06", "Đã phân công", "6", "2025-01-04 14:25:50", ""],
  ["5", "7" , "2", "2025-01-07", "Hoàn thành", "6", "2025-01-05 10:05:00", ""],
  ["6", "11", "3", "2025-01-07", "Đã phân công", "6", "2025-01-05 10:10:33", ""],
  ["7", "2", "1", "2025-01-08", "Vắng", "6", "2025-01-06 09:40:12", "Ốm"],
  ["8", "4", "2", "2025-01-08", "Hoàn thành", "6", "2025-01-06 09:45:31", ""],
  ["9", "7", "3", "2025-01-09", "Đã phân công", "6", "2025-01-07 08:22:15", ""],
  ["10", "11", "1", "2025-01-09", "Đã phân công", "6", "2025-01-07 08:25:40", ""],
  ["11", "2", "2", "2025-01-10", "Hoàn thành", "6", "2025-01-08 13:11:05", ""],
  ["12", "4", "3", "2025-01-10", "Đã phân công", "6", "2025-01-08 13:15:44", ""]
];

// Map sang object + instance Assignment
export const dataPhanCong = rawPhanCong.map(
  ([id, userId, shiftId, workDate, status, assignedById, assignedAt, note]) => {

    const user = dataNguoiDung.find(u => u.id.toString() === userId.toString()) || null;
    const assignedBy = dataNguoiDung.find(u => u.id.toString() === assignedById.toString()) || null;
    const shift = dataThoiGianBieu.find(s => s.id.toString() === shiftId.toString()) || null;

    return {
      id: id.toString(),
      userId: userId.toString(),
      user,
      shiftId: shiftId.toString(),
      shift,
      workDate,
      status,
      assignedById: assignedById.toString(),
      assignedBy,
      assignedAt,
      note,
      instance: new Assignment(
        id.toString(),
        user,
        shift,
        workDate,
        status,
        assignedBy,
        assignedAt,
        note
      )
    };
  }
);

// --- Helper ---
export const getAssignmentById = (id) =>
  dataPhanCong.find(a => a.id.toString() === id.toString()) || null;

// Lọc theo tiêu chí
export const getAssignmentsByFilter = ({
  userId = "",
  shiftId = "",
  workDate = "",
  status = "",
  assignedById = ""
} = {}) => {
  const allEmpty = !userId && !shiftId && !workDate && !status && !assignedById;

  return dataPhanCong
    .filter(a => {
      if (allEmpty) return true;

      const matchUser = userId ? a.userId === userId.toString() : true;
      const matchShift = shiftId ? a.shiftId === shiftId.toString() : true;
      const matchDate = workDate ? a.workDate === workDate : true;
      const matchStatus = status ? a.status === status : true;
      const matchAssignedBy = assignedById ? a.assignedById === assignedById.toString() : true;

      return matchUser && matchShift && matchDate && matchStatus && matchAssignedBy;
    });
};
