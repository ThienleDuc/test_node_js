// src/pages/PhieuNhap.jsx
import React, { useState, useEffect, useMemo } from "react";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import { Link } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";
import { getRoleFlags } from "../utils/roleCheck";
import { getReceiptsByFilter, getReceiptById } from "../data/dataPhieuNhap";
import { dataNhaCungCap } from "../data/dataNhaCungCap";
import { dataNguoiDung } from "../data/dataNguoiDung";
import { FaSquare, FaCheckSquare } from "react-icons/fa";
import { exportExcel } from "../components/exportExcel";


function PhieuNhap() {
  const { session } = useSession();
  const { isQuanLyCuaHang, isQuanKho } = getRoleFlags(session?.role);

  // Filter
  const [filterNgay, setFilterNgay] = useState("");
  const [filterNCC, setFilterNCC] = useState(""); // lưu id
  const [filterNguoiNhap, setFilterNguoiNhap] = useState(""); // lưu id 

  // Modal state
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [, setNgayEdit] = useState("");
  const [nccEdit, setNCCEdit] = useState("");
  const [, setNguoiNhapEdit] = useState("");
  const [, setTongTienEdit] = useState("");

  const columns = ["Mã PN", "Ngày nhập", "Nhà cung cấp", "Người nhập", "Tổng tiền", "Tác vụ"];

  // Filter dữ liệu
  const filteredData = useMemo(() => {
    const receipts = getReceiptsByFilter({
      date: filterNgay,
      supplierId: filterNCC,
      createdById: filterNguoiNhap
    });

    if (isQuanKho) return receipts.filter(r => r.createdBy?.id === session?.id);

    return receipts;
  }, [filterNgay, filterNCC, filterNguoiNhap, session?.id, isQuanKho]);

  // Khi mở modal
  useEffect(() => {
    const editModalEl = document.getElementById("editModal");
    const deleteModalEl = document.getElementById("deleteModal");

    const handleShow = (event) => {
      const button = event.relatedTarget;
      const receiptId = button.getAttribute("data-receipt-id");
      if (!receiptId) return;
      const receipt = getReceiptById(receiptId);
      if (!receipt) return;

      if (button.dataset.bsTarget === "#editModal") {
        setCurrentReceipt(receipt);
        setNgayEdit(receipt.date);
        setNCCEdit(receipt.supplier?.id || "");
        setNguoiNhapEdit(receipt.createdBy?.id || "");
        setTongTienEdit(receipt.totalAmount);
      } else if (button.dataset.bsTarget === "#deleteModal") {
        setCurrentReceipt(receipt);
      }
    };

    if (editModalEl) editModalEl.addEventListener("show.bs.modal", handleShow);
    if (deleteModalEl) deleteModalEl.addEventListener("show.bs.modal", handleShow);

    return () => {
      if (editModalEl) editModalEl.removeEventListener("show.bs.modal", handleShow);
      if (deleteModalEl) deleteModalEl.removeEventListener("show.bs.modal", handleShow);
    };
  }, []);

  // state quản lý checkbox cho từng phiếu nhập
  const [checkedMap, setCheckedMap] = useState({});

  // state checkbox "Chọn tất cả"
  const [checkAll, setCheckAll] = useState(false);

  // toggle từng checkbox
  const toggleChecked = (id) => {
    setCheckedMap(prev => {
      const newChecked = { ...prev, [id]: !prev[id] };
      // Nếu bỏ 1 trong số các checkbox, bỏ tick checkAll
      if (!newChecked[id]) setCheckAll(false);
      return newChecked;
    });
  };

  // toggle checkbox "Chọn tất cả"
  const toggleCheckAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);

    const newCheckedMap = {};
    filteredData.forEach(r => {
      newCheckedMap[r.id] = newCheckAll;
    });
    setCheckedMap(newCheckedMap);
  };

  // tính tổng tiền của các phiếu nhập đã chọn
  const totalSelectedAmount = filteredData.reduce((sum, r) => {
    return checkedMap[r.id] ? sum + r.totalAmount : sum;
  }, 0);

  const handleExportExcel = () => {
    // Lấy các phiếu nhập đã chọn
    const selectedData = filteredData
      .filter(r => checkedMap[r.id])
      .map(r => ({
        "Mã PN": r.id,
        "Ngày nhập": r.date,
        "Nhà cung cấp": r.supplier?.name || "",
        "Người nhập": r.createdBy?.name || "",
        "Tổng tiền": r.totalAmount + " " + r.unit
      }));

    if (selectedData.length === 0) {
      alert("Vui lòng chọn ít nhất 1 phiếu nhập để xuất Excel!");
      return;
    }

    exportExcel(selectedData, [], `PhieuNhap_${Date.now()}.xlsx`);
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Phiếu Nhập</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Bảng dưới đây hiển thị các phiếu nhập hàng.</p>
        {isQuanLyCuaHang && (
          <button
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#addModal"
          >
            <i className="fas fa-plus me-1"></i> Thêm mới
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <label className="form-label">Ngày nhập</label>
          <input
            type="date"
            className="form-control"
            value={filterNgay}
            onChange={e => setFilterNgay(e.target.value)}
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

        {isQuanLyCuaHang && (
          <div className="col-md-3">
            <label className="form-label">Người nhập</label>
            <SelectWithScroll
              options={["Tất cả", ...dataNguoiDung.map(u => `${u.id}: ${u.name}`)]} 
              value={filterNguoiNhap === "" ? "Tất cả" : `${filterNguoiNhap}: ${dataNguoiDung.find(u => u.id === filterNguoiNhap)?.name}`}
              onChange={val => setFilterNguoiNhap(val === "Tất cả" ? "" : val.split(":")[0])}
            />
          </div>
        )}
      </div>

      {/* Table */}
      <TableComponent
        title="Danh sách Phiếu Nhập"
        columns={columns}
        data={filteredData.map(r => [
          r.id,
          r.date,
          r.supplier?.name || "",
          r.createdBy?.name || "",
          `${r.totalAmount} ${r.unit} `
        ])}
        renderCell={(cell, column, row) => {
          if (column === "Tác vụ") {
            const isChecked = checkedMap[row[0]] || false;
            return (
              <td className="d-flex gap-1">
                <Link to={`/phieu-nhap/${row[0]}`} className="btn btn-info btn-sm">
                  <i className="fas fa-search"></i>
                </Link>
                <button
                  className="btn btn-primary btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  data-receipt-id={row[0]}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  data-receipt-id={row[0]}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
                <span className="d-flex align-items-center"
                  style={{
                    cursor: "pointer",
                    fontSize: "1rem", // tương đương chiều cao ~16px, có thể tăng nếu muốn
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
              <h5 className="modal-title">Thêm Phiếu Nhập</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nhà cung cấp</label>
                <SelectWithScroll
                  options={["Tất cả", ...dataNhaCungCap.map(n => `${n.id}: ${n.name}`)]}
                  value={nccEdit ? `${nccEdit}: ${dataNhaCungCap.find(n => n.id === nccEdit)?.name}` : "Tất cả"}
                  onChange={val => setNCCEdit(val === "Tất cả" ? "" : val.split(":")[0])}
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
              <h5 className="modal-title">Chỉnh sửa Phiếu Nhập</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {currentReceipt ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Nhà cung cấp</label>
                    <SelectWithScroll
                      options={[...dataNhaCungCap.map(n => `${n.id}: ${n.name}`)]}
                      value={nccEdit ? `${nccEdit}: ${dataNhaCungCap.find(n => n.id === nccEdit)?.name}` : ""}
                      onChange={val => setNCCEdit(val === "" ? "" : val.split(":")[0])}
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
              {currentReceipt ? (
                <p>Bạn có chắc muốn xóa phiếu nhập <strong>{currentReceipt.id}</strong>?</p>
              ) : <p>Đang tải...</p>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Không</button>
              <button className="btn btn-danger" data-bs-dismiss="modal">Có</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhieuNhap;
