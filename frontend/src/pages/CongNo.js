// src/pages/CongNo.jsx
import React, { useState, useEffect, useMemo } from "react";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import { getDebtsByFilter, getDebtById } from "../data/dataCongNo";
import { dataNhaCungCap } from "../data/dataNhaCungCap";
import { FaSquare, FaCheckSquare } from "react-icons/fa";
import { exportExcel } from "../components/exportExcel";

function CongNo() {
  // Filter
  const [filterLoai, setFilterLoai] = useState("");
  const [filterDoiTuong, setFilterDoiTuong] = useState("");
  const [filterNCC, setFilterNCC] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("");

  // Modal state
  const [currentDebt, setCurrentDebt] = useState(null);
  const [loaiEdit, setLoaiEdit] = useState("");
  const [doiTuongEdit, setDoiTuongEdit] = useState("");
  const [nccEdit, setNCCEdit] = useState("");
  const [tenKHEdit, setTenKHEdit] = useState("");
  const [soTienEdit, setSoTienEdit] = useState("");
  const [hanTTEdit, setHanTTEdit] = useState("");
  const [trangThaiEdit, setTrangThaiEdit] = useState("");

  const columns = ["ID", "Loại CN", "Đối tượng", "Nhà cung cấp", "Tên KH", "Số tiền", "Hạn TT", "Trạng thái", "Tác vụ"];

  // Filter dữ liệu
  const filteredData = useMemo(() => {
    return getDebtsByFilter({
      loaiCongNo: filterLoai,
      doiTuong: filterDoiTuong,
      maNCC: filterNCC,
      trangThai: filterTrangThai
    });
  }, [filterLoai, filterDoiTuong, filterNCC, filterTrangThai]);

  // Checkbox state
  const [checkedMap, setCheckedMap] = useState({});
  const [checkAll, setCheckAll] = useState(false);

  const toggleChecked = (id) => {
    setCheckedMap(prev => {
      const newChecked = { ...prev, [id]: !prev[id] };
      if (!newChecked[id]) setCheckAll(false);
      return newChecked;
    });
  };

  const toggleCheckAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);

    const newCheckedMap = {};
    filteredData.forEach(d => {
      newCheckedMap[d.id] = newCheckAll;
    });
    setCheckedMap(newCheckedMap);
  };

  const totalSelectedAmount = filteredData.reduce((sum, d) => {
    if (!checkedMap[d.id]) return sum;

    // Nếu là Phải thu → cộng, Phải trả → trừ
    const amount = d.loaiCongNo === "Phải thu" ? d.soTien : -d.soTien;

    return sum + amount;
  }, 0);

  const handleExportExcel = () => {
    const selectedData = filteredData
      .filter(d => checkedMap[d.id])
      .map(d => ({
        "ID": d.id,
        "Loại công nợ": d.loaiCongNo,
        "Đối tượng": d.doiTuong,
        "Nhà cung cấp": d.maNCC ? dataNhaCungCap.find(n => n.id === d.maNCC)?.name : "",
        "Tên khách hàng": d.tenKhachHang || "",
        "Số tiền": d.soTien,
        "Hạn thanh toán": d.hanThanhToan,
        "Trạng thái": d.trangThai
      }));

    if (selectedData.length === 0) {
      alert("Vui lòng chọn ít nhất 1 công nợ để xuất Excel!");
      return;
    }

    exportExcel(selectedData, [], `CongNo_${Date.now()}.xlsx`);
  };

  // Khi mở modal
  useEffect(() => {
    const editModalEl = document.getElementById("editModal");
    const deleteModalEl = document.getElementById("deleteModal");

    const handleShow = (event) => {
      const button = event.relatedTarget;
      const debtId = button?.getAttribute("data-debt-id");
      if (!debtId) return;
      const debt = getDebtById(debtId);
      if (!debt) return;

      if (button.dataset.bsTarget === "#editModal") {
        setCurrentDebt(debt);
        setLoaiEdit(debt.loaiCongNo);
        setDoiTuongEdit(debt.doiTuong);
        setNCCEdit(debt.maNCC || "");
        setTenKHEdit(debt.tenKhachHang || "");
        setSoTienEdit(debt.soTien);
        setHanTTEdit(debt.hanThanhToan);
        setTrangThaiEdit(debt.trangThai);
      } else if (button.dataset.bsTarget === "#deleteModal") {
        setCurrentDebt(debt);
      }
    };

    if (editModalEl) editModalEl.addEventListener("show.bs.modal", handleShow);
    if (deleteModalEl) deleteModalEl.addEventListener("show.bs.modal", handleShow);

    return () => {
      if (editModalEl) editModalEl.removeEventListener("show.bs.modal", handleShow);
      if (deleteModalEl) deleteModalEl.removeEventListener("show.bs.modal", handleShow);
    };
  }, []);

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Công nợ</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Bảng dưới đây hiển thị các công nợ.</p>
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
        >
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* Filter */}
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <label className="form-label">Loại công nợ</label>
          <SelectWithScroll
            options={["Tất cả", "Phải thu", "Phải trả"]}
            value={filterLoai || "Tất cả"}
            onChange={val => setFilterLoai(val === "Tất cả" ? "" : val)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Đối tượng</label>
          <SelectWithScroll
            options={["Tất cả", "Khách hàng", "Nhà cung cấp"]}
            value={filterDoiTuong || "Tất cả"}
            onChange={val => setFilterDoiTuong(val === "Tất cả" ? "" : val)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Nhà cung cấp</label>
          <SelectWithScroll
            options={["Tất cả", ...dataNhaCungCap.map(n => `${n.id}: ${n.name}`)]}
            value={filterNCC === "" ? "Tất cả" : `${filterNCC}: ${dataNhaCungCap.find(n => n.id === filterNCC)?.name}`}
            onChange={val => setFilterNCC(val === "Tất cả" ? "" : val.split(":")[0])}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Trạng thái</label>
          <SelectWithScroll
            options={["Tất cả", "Chưa thanh toán", "Đã thanh toán", "Hủy thanh toán"]}
            value={filterTrangThai || "Tất cả"}
            onChange={val => setFilterTrangThai(val === "Tất cả" ? "" : val)}
          />
        </div>
      </div>

      {/* Table */}
      <TableComponent
        title="Danh sách Công nợ"
        columns={columns}
        data={filteredData.map(d => [
          d.id,
          d.loaiCongNo,
          d.doiTuong,
          d.maNCC ? dataNhaCungCap.find(n => n.id === d.maNCC)?.name : "",
          d.tenKhachHang || "",
          d.soTien,
          d.hanThanhToan,
          d.trangThai
        ])}
        renderCell={(cell, column, row) => {
          if (column === "Tác vụ") {
            const isChecked = checkedMap[row[0]] || false;
            return (
              <td className="d-flex gap-1">
                <button
                  className="btn btn-primary btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  data-debt-id={row[0]}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  data-debt-id={row[0]}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
                <span
                  className="d-flex align-items-center"
                  style={{
                    cursor: "pointer",
                    fontSize: "1rem",
                    width: "30px",
                    height: "31px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isChecked ? "#28a745" : "#6c757d",
                    transition: "color 0.2s"
                  }}
                  onClick={() => toggleChecked(row[0])}
                  title={isChecked ? "Đã chọn" : "Chưa chọn"}
                >
                  {isChecked ? <FaCheckSquare size={18} /> : <FaSquare size={18} />}
                </span>
              </td>
            );
          }
          return <td>{cell}</td>;
        }}
      />

      <div className="d-flex justify-content-between align-items-center mt-2">
        <div>
          <input
            type="checkbox"
            checked={checkAll}
            onChange={toggleCheckAll}
            id="checkAll"
            className="form-check-input me-2"
          />
          <label htmlFor="checkAll" className="form-check-label">Chọn tất cả</label>
        </div>
        <div className="d-flex gap-2 align-items-center"> 
          <strong>Tổng tiền đã chọn: </strong> {totalSelectedAmount} VNĐ
          <button
            className="btn btn-sm btn-outline-success"
            onClick={handleExportExcel}
          >
            <i className="fas fa-file-excel me-1"></i> Xuất Excel
          </button>
        </div>
      </div>

      {/* Modal Thêm */}
      <div className="modal fade" id="addModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm Công nợ</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Loại công nợ</label>
                <SelectWithScroll
                  options={["Phải thu", "Phải trả"]}
                  value={loaiEdit}
                  onChange={val => setLoaiEdit(val)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Đối tượng</label>
                <SelectWithScroll
                  options={["Khách hàng", "Nhà cung cấp"]}
                  value={doiTuongEdit}
                  onChange={val => setDoiTuongEdit(val)}
                />
              </div>
              {doiTuongEdit === "Nhà cung cấp" && (
                <div className="mb-3">
                  <label className="form-label">Nhà cung cấp</label>
                  <SelectWithScroll
                    options={[...dataNhaCungCap.map(n => `${n.id}: ${n.name}`)]}
                    value={nccEdit ? `${nccEdit}: ${dataNhaCungCap.find(n => n.id === nccEdit)?.name}` : ""}
                    onChange={val => setNCCEdit(val.split(":")[0])}
                  />
                </div>
              )}
              {doiTuongEdit === "Khách hàng" && (
                <div className="mb-3">
                  <label className="form-label">Tên khách hàng</label>
                  <input type="text" className="form-control" value={tenKHEdit} onChange={e => setTenKHEdit(e.target.value)} />
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Số tiền</label>
                <input type="number" className="form-control" value={soTienEdit} onChange={e => setSoTienEdit(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Hạn thanh toán</label>
                <input type="date" className="form-control" value={hanTTEdit} onChange={e => setHanTTEdit(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Trạng thái</label>
                <SelectWithScroll
                  options={["Chưa thanh toán", "Đã thanh toán"]}
                  value={trangThaiEdit}
                  onChange={val => setTrangThaiEdit(val)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-success" data-bs-dismiss="modal">Thêm mới</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Sửa */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa Công nợ</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {currentDebt ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Loại công nợ</label>
                    <SelectWithScroll
                      options={["Phải thu", "Phải trả"]}
                      value={loaiEdit}
                      onChange={val => setLoaiEdit(val)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Đối tượng</label>
                    <SelectWithScroll
                      options={["Khách hàng", "Nhà cung cấp"]}
                      value={doiTuongEdit}
                      onChange={val => setDoiTuongEdit(val)}
                    />
                  </div>
                  {doiTuongEdit === "Nhà cung cấp" && (
                    <div className="mb-3">
                      <label className="form-label">Nhà cung cấp</label>
                      <SelectWithScroll
                        options={[...dataNhaCungCap.map(n => `${n.id}: ${n.name}`)]}
                        value={nccEdit ? `${nccEdit}: ${dataNhaCungCap.find(n => n.id === nccEdit)?.name}` : ""}
                        onChange={val => setNCCEdit(val.split(":")[0])}
                      />
                    </div>
                  )}
                  {doiTuongEdit === "Khách hàng" && (
                    <div className="mb-3">
                      <label className="form-label">Tên khách hàng</label>
                      <input type="text" className="form-control" value={tenKHEdit} onChange={e => setTenKHEdit(e.target.value)} />
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Số tiền</label>
                    <input type="number" className="form-control" value={soTienEdit} onChange={e => setSoTienEdit(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Hạn thanh toán</label>
                    <input type="date" className="form-control" value={hanTTEdit} onChange={e => setHanTTEdit(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Trạng thái</label>
                    <SelectWithScroll
                      options={["Chưa thanh toán", "Đã thanh toán"]}
                      value={trangThaiEdit}
                      onChange={val => setTrangThaiEdit(val)}
                    />
                  </div>
                </>
              ) : <p>Đang tải...</p>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-primary" data-bs-dismiss="modal">Lưu</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Xóa */}
      <div className="modal fade" id="deleteModal" tabIndex="-1">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xác nhận xóa</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {currentDebt ? (
                <p>Bạn có chắc muốn xóa công nợ <strong>{currentDebt.id}</strong> không?</p>
              ) : <p>Đang tải...</p>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-danger" data-bs-dismiss="modal">Xóa</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default CongNo;
