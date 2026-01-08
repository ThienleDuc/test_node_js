import React, { useState, useMemo, useEffect } from "react";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import { useSession } from "../contexts/SessionContext";
import { getRoleFlags } from "../utils/roleCheck";
import { dataNguoiDung, getUserById } from "../data/dataNguoiDung";
import { calcHours } from "../data/dataChamCong";
import { getShiftById } from "../data/dataThoiGianBieu";
import { FaSquare, FaCheckSquare } from "react-icons/fa";
import { getAttendanceByFilter} from "../data/dataChamCong"
import { getAssignmentById } from "../data/dataPhanCong";

function ThanhToanCa() {
  const { session } = useSession();
  const { isQuanLyCuaHang } = getRoleFlags(session?.role);

  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("");
  const [filterNguoi, setFilterNguoi] = useState("");

  const [checkedMap, setCheckedMap] = useState({});
  const [checkAll, setCheckAll] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});

  const columns = [
    "Mã CC",
    "Nhân viên",
    "Ngày làm",
    "Giờ vào",
    "Giờ ra",
    "Tổng giờ làm",
    "Tiền thực lãnh",
    "Trạng thái",
    "Ghi chú",
    "Tác vụ"
  ];

const [attendanceData, setAttendanceData] = useState([]);

// Khởi tạo dữ liệu gốc khi component mount
useEffect(() => {
  const data = getAttendanceByFilter({
    fromDate: "",
    toDate: "",
    trangThai: "",
    maNguoiDung: isQuanLyCuaHang ? filterNguoi : session?.id
  }).map((a, index)=> {
    const assignment = getAssignmentById(a._maLichNV);
    const ca = getShiftById(assignment?.shiftId);
    const donGia = ca?.donGia || 0;

    const gioVao = a._gioVao || "";
    const gioRa = a._gioRa || "";
    const tongGioLam = calcHours(gioVao, gioRa);
    const tienThucLanh = tongGioLam * donGia;

    const user = getUserById(a._maNguoiDung);

    return {
      ...a,
      _id: a._id || index,
      _tenNguoiDung: user?.name || "--",
      _tongGioLam: tongGioLam,
      _tienThucLanh: tienThucLanh,
      _ngayLam: assignment.workDate
    };
  });

  setAttendanceData(data);
}, [filterNguoi, isQuanLyCuaHang, session?.id]); // Các dependency cần thiết

// filteredData chỉ dùng useMemo để lọc dựa trên attendanceData
const filteredData = useMemo(() => {
  return attendanceData.filter(a => {
    const matchFromDate = !filterFromDate || a._ngayCapNhat >= filterFromDate;
    const matchToDate = !filterToDate || a._ngayCapNhat <= filterToDate;
    const matchTrangThai = !filterTrangThai || a._trangThai === filterTrangThai;
    const matchNguoi = !filterNguoi || a._maNguoiDung === filterNguoi;

    return matchFromDate && matchToDate && matchTrangThai && matchNguoi;
  });
}, [attendanceData, filterFromDate, filterToDate, filterTrangThai, filterNguoi]);


  // Checkbox toggle 1 row
 const toggleChecked = id => {
  setCheckedMap(prev => {
    const newChecked = { ...prev, [id]: !prev[id] };
    if (!newChecked[id]) setCheckAll(false);
    return newChecked;
  });
};

  // Checkbox toggle all
  const toggleCheckAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);

    const newCheckedMap = {};
    filteredData.forEach(r => (newCheckedMap[r._id] = newCheckAll));
    setCheckedMap(newCheckedMap);
  };

  // Toggle trạng thái thanh toán 1 row
  const toggleTrangThai = id => {
    setDataUpdate(prev => ({ ...prev, [id]: true }));
  };

  // Thanh toán tất cả rows được chọn
  const handleThanhToan = () => {
    setDataUpdate(prev => {
      const newData = { ...prev };
      filteredData.forEach(r => {
        if (checkedMap[r._id]) newData[r._id] = true;
      });
      return newData;
    });
    alert("Đã thanh toán các ca được chọn!");
  };

  const totalSelectedAmount = filteredData.reduce((sum, r) => {
    return checkedMap[r._id] ? r._tienThucLanh + sum : sum;
  }, 0);


  const handleChamCong = id => {
    const now = new Date();
    const gioVao = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setAttendanceData(prev =>
      prev.map(r => (r._id === id ? { ...r, _gioVao: gioVao } : r))
    );
  };
    
  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Thanh Toán Ca</h1>
      <p className="mb-3">Bảng dưới đây hiển thị các ca làm việc, tổng giờ và tiền thực lãnh.</p>

      {/* Filters */}
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <label>Từ ngày</label>
          <input
            type="date"
            className="form-control"
            value={filterFromDate}
            onChange={e => setFilterFromDate(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label>Đến ngày</label>
          <input
            type="date"
            className="form-control"
            value={filterToDate}
            onChange={e => setFilterToDate(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label>Trạng thái</label>
          <SelectWithScroll
            options={["Tất cả", "Đã thanh toán", "Chưa thanh toán"]}
            value={
              filterTrangThai === ""
                ? "Tất cả"
                : filterTrangThai
            }
            onChange={val => setFilterTrangThai(val === "Tất cả" ? "" : val)}
          />
        </div>

        {isQuanLyCuaHang && (
          <div className="col-md-3">
            <label>Nhân viên</label>
           <SelectWithScroll
              options={["Tất cả", ...dataNguoiDung.map(u => `${u.id}: ${u.name}`)]} 
              value={
                filterNguoi === ""
                  ? "Tất cả"
                  : `${filterNguoi}: ${getUserById(String(filterNguoi))?.name || "--"}`
              }
              onChange={val =>
                setFilterNguoi(val === "Tất cả" ? "" : String(val.split(":")[0]))
              }
            />
          </div>
        )}
      </div>

      {/* Table */}
      <TableComponent
        title="Danh sách Thanh Toán Ca"
        columns={columns}
        data={filteredData.map(r => [
          r._id,
          r._tenNguoiDung,
          r._ngayLam,
          r._gioVao || "--:--",
          r._gioRa || "--:--",
          Number(r._tongGioLam || 0).toFixed(2),          
          Number(r._tienThucLanh || 0).toLocaleString("vi-VN"),
          dataUpdate[r._id] ?? r._trangThai,
          r._ghiChu
        ])}
        renderCell={(cell, column, row) => {
          const id = row[0];

          if (column === "Tác vụ") {
            const isChecked = checkedMap[id] || false;
            return (
              <td className="d-flex gap-1">
                <span
                  style={{
                    cursor: "pointer",
                    fontSize: "1rem",
                    width: "30px",
                    height: "31px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isChecked ? "#28a745" : "#6c757d"
                  }}
                  onClick={() => toggleChecked(id)}
                >
                  {isChecked ? <FaCheckSquare size={18} /> : <FaSquare size={18} />}
                </span>

                <span
                style={{
                  cursor: "pointer",
                  fontSize: "1rem",
                  width: "30px",
                  height: "31px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#007bff"
                }}
                title="Chấm công"
                onClick={() => handleChamCong(id)}
              >
                ⏱️
              </span>
              </td>
            );
          }

          if (column === "Trạng thái") {
            const isPaid = Boolean(dataUpdate[id] ?? (row[7] === true || row[7] === "Đã thanh toán"));
            return (
              <td>
                {isQuanLyCuaHang ? (
                  <button
                    className={`btn btn-sm ${isPaid ? "btn-success" : "btn-outline-danger"}`}
                    disabled={isPaid}
                    onClick={() => !isPaid && toggleTrangThai(id)}
                  >
                    {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </button>
                ) : (
                  <span>{isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</span>
                )}

              </td>
            );
          }

          return <td>{cell}</td>;
        }}
      />

      {/* Footer */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <input
            type="checkbox"
            checked={checkAll}
            onChange={toggleCheckAll}
            className="form-check-input me-2"
          />
          <label className="form-check-label">Chọn tất cả</label>
        </div>

        <div className="d-flex gap-2 align-items-center">
          <strong>Tổng tiền thực lãnh đã chọn: </strong>
          {totalSelectedAmount.toLocaleString("vi-VN")} VNĐ

          {isQuanLyCuaHang && (
            <button className="btn btn-sm btn-success" onClick={handleThanhToan}>
              Thanh toán
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ThanhToanCa;
