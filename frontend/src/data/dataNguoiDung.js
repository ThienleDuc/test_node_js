import { dataVaiTro } from "./dataVaiTro";

const rawNguoiDung = [
  ["1",  "Nguyễn Văn A", "admin@example.com",     "12345", true, "2025-01-05",   "1"],
  ["2",  "Trần Thị B",   "b.tran@example.com",     "12345", false,     "2025-02-02",   "4"],
  ["3",  "Lê Văn C",     "c.le@example.com",        "12345", true, "2025-01-10", "1"],
  ["4",  "Phạm Thị D",   "thungan@example.com",     "12345", true, "2025-03-01", "3"],
  ["5",  "Bùi Văn E",    "e.bui@example.com",       "12345", false,     "2025-03-12",  "4"],
  ["6",  "Đặng Thị F",   "cuahang@example.com",     "12345", true, "2025-04-10", "2"],
  ["7",  "Trương Văn G", "kho@example.com",         "12345", true, "2025-04-17", "4"],
  ["8",  "Hồ Thị H",     "h.ho@example.com",        "12345", false,     "2025-02-22",  "3"],
  ["9",  "Mai Văn I",    "i.mai@example.com",       "12345", true, "2025-01-30", "2"],
  ["10", "Đoàn Thị J",   "j.doan@example.com",      "12345", false,     "2025-03-14",  "4"],
  ["11", "Vũ Văn K",     "k.vu@example.com",        "12345", true, "2025-04-01", "4"],
  ["12", "Ngô Thị L",    "l.ngo@example.com",       "12345", true, "2025-04-20", "1"]
];

// map sang object
export const dataNguoiDung = rawNguoiDung.map(
  ([id, name, email, password, status, createdAt, roleId]) => {
    // Tìm role theo id string
    const roleInstance = dataVaiTro.find(r => r.id === roleId);
    const roleObj = roleInstance
      ? {
          id: roleInstance.id,
          name: roleInstance.name,
          description: roleInstance.description
        }
      : null;

    return {
      id: id.toString(),
      name,
      email,
      _password: password,
      status: true ? "Hoạt động" : "Khóa",
      createdAt,
      role: roleObj,
      avatar: null
    };
  }
);

export const getUsersByFilter = ({ name = "", role = "", status = "" } = {}) => {
  const allEmpty = !name && !role && !status;

  return dataNguoiDung
    .filter(u => {
      if (allEmpty) return true;

      const userName = (u.name || "").toLowerCase();
      const userRoleId = u.role?.id?.toString() || "";
      const userStatus = u.status || "";

      const matchName = name ? userName.includes(name.toLowerCase()) : true;
      const matchRole = role ? userRoleId === role.toString() : true;
      const matchStatus = status ? userStatus === status : true;

      return matchName && matchRole && matchStatus;
    })
    .map(u => ({ ...u, avatar: u.avatar || null }));
};

export function getUserById(id) {
  return dataNguoiDung.find(u => u.id === id);
}
