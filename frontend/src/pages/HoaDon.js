// src/pages/HoaDon.jsx
import React, { useState, useEffect, useMemo } from "react";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import { useSession } from "../contexts/SessionContext";
import { getRoleFlags } from "../utils/roleCheck";
import { dataNguoiDung } from "../data/dataNguoiDung";
import { dataThoiGianBieu } from "../data/dataThoiGianBieu";
import { getInvoicesByFilter, getInvoiceById } from "../data/dataHoaDon";
import { FaSquare, FaCheckSquare } from "react-icons/fa";
import { exportExcel } from "../components/exportExcel";
import { Link } from "react-router-dom";

function HoaDon() {
  const { session } = useSession();
  const { isQuanLyCuaHang } = getRoleFlags(session?.role);

  // Filter
  const [filterNgay, setFilterNgay] = useState("");
  const [filterThuNgan, setFilterThuNgan] = useState("");
  const [filterPhuongThuc, setFilterPhuongThuc] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("");

  // Modal state
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [ngayEdit, setNgayEdit] = useState("");
  const [, setThuNganEdit] = useState("");
  const [, setPhuongThucEdit] = useState("");
  const [trangThaiEdit, setTrangThaiEdit] = useState("");
  const [, setTongTienEdit] = useState("");

  const [nguoiEdit, setNguoiEdit] = useState("");
  const [caEdit, setCaEdit] = useState("");

  const columns = ["Mã HĐ", "Ngày lập", "Thu ngân", "Phương thức", "Trạng thái", "Tổng tiền", "Tác vụ"];

  // Filter dữ liệu
  const filteredData = useMemo(() => {
    const invoices = getInvoicesByFilter({
      date: filterNgay,
      createdById: filterThuNgan,
      paymentMethod: filterPhuongThuc,
      status: filterTrangThai
    });
    return invoices;
  }, [filterNgay, filterThuNgan, filterPhuongThuc, filterTrangThai]);

  // Khi mở modal
  useEffect(() => {
    const editModalEl = document.getElementById("editModal");
    const deleteModalEl = document.getElementById("deleteModal");

    const handleShow = (event) => {
      const button = event.relatedTarget;
      const invoiceId = button.getAttribute("data-invoice-id");
      if (!invoiceId) return;
      const invoice = getInvoiceById(invoiceId);
      if (!invoice) return;

      if (button.dataset.bsTarget === "#editModal") {
        setCurrentInvoice(invoice);
        setNgayEdit(invoice.date);
        setThuNganEdit(invoice.createdBy?.id || "");
        setPhuongThucEdit(invoice.paymentMethod);
        setTrangThaiEdit(invoice.status);
        setTongTienEdit(invoice.totalAmount);
      } else if (button.dataset.bsTarget === "#deleteModal") {
        setCurrentInvoice(invoice);
      }
    };

    if (editModalEl) editModalEl.addEventListener("show.bs.modal", handleShow);
    if (deleteModalEl) deleteModalEl.addEventListener("show.bs.modal", handleShow);

    return () => {
      if (editModalEl) editModalEl.removeEventListener("show.bs.modal", handleShow);
      if (deleteModalEl) deleteModalEl.removeEventListener("show.bs.modal", handleShow);
    };
  }, []);

  // Checkbox
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
    filteredData.forEach(r => {
      newCheckedMap[r.id] = newCheckAll;
    });
    setCheckedMap(newCheckedMap);
  };

  const totalSelectedAmount = filteredData.reduce((sum, r) => checkedMap[r.id] ? sum + r.totalAmount : sum, 0);

  const handleExportExcel = () => {
    const selectedData = filteredData
      .filter(r => checkedMap[r.id])
      .map(r => ({
        "Mã HĐ": r.id,
        "Ngày lập": r.date,
        "Thu ngân": r.createdBy?.name || "",
        "Phương thức": r.paymentMethod,
        "Trạng thái": r.status,
        "Tổng tiền": r.totalAmount + " " + r.unit
      }));

    if (selectedData.length === 0) {
      alert("Vui lòng chọn ít nhất 1 hóa đơn để xuất Excel!");
      return;
    }

    exportExcel(selectedData, [], `HoaDon_${Date.now()}.xlsx`);
  };

  // Các options cho Select
  const paymentMethods = Array.from(new Set(filteredData.map(inv => inv.paymentMethod)));
  const statuses = Array.from(new Set(filteredData.map(inv => inv.status)));

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Hóa Đơn</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Bảng dưới đây hiển thị danh sách ({filteredData.length}) phiếu hóa đơn.</p>
        <button
          className="btn btn-success btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
        >
          <i className="fas fa-plus me-1"></i> Thêm Hóa Đơn
        </button>
      </div>

      {/* Filter */}
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <label className="form-label">Ngày lập</label>
          <input
            type="date"
            className="form-control"
            value={filterNgay}
            onChange={e => setFilterNgay(e.target.value)}
          />
        </div>

        {isQuanLyCuaHang && (
          <div className="col-md-3">
            <label className="form-label">Thu ngân</label>
            <SelectWithScroll
              options={["Tất cả", ...dataNguoiDung.map(u => `${u.id}: ${u.name}`)]}
              value={filterThuNgan === "" ? "Tất cả" : `${filterThuNgan}: ${dataNguoiDung.find(u => u.id === filterThuNgan)?.name}`}
              onChange={val => setFilterThuNgan(val === "Tất cả" ? "" : val.split(":")[0])}
            />
          </div>
        )}

        <div className="col-md-3">
          <label className="form-label">Phương thức</label>
          <SelectWithScroll
            options={["Tất cả", ...paymentMethods]}
            value={filterPhuongThuc || "Tất cả"}
            onChange={val => setFilterPhuongThuc(val === "Tất cả" ? "" : val)}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Trạng thái</label>
          <SelectWithScroll
            options={["Tất cả", ...statuses]}
            value={filterTrangThai || "Tất cả"}
            onChange={val => setFilterTrangThai(val === "Tất cả" ? "" : val)}
          />
        </div>
      </div>

      {/* Table */}
      <TableComponent
        title="Danh sách Hóa Đơn"
        columns={columns}
        data={filteredData.map(r => [
          r.id,
          r.date,
          r.createdBy?.name || "",
          r.paymentMethod,
          r.status,
          `${r.totalAmount} ${r.unit}`
        ])}
        renderCell={(cell, column, row) => {
          if (column === "Tác vụ") {
            const isChecked = checkedMap[row[0]] || false;
            return (
              <td className="d-flex gap-1">
                <Link to={`/lap-hoa-don/${row[0]}`} className="btn btn-info btn-sm">
                  <i className="fas fa-search"></i>
                </Link>
                <button
                  className="btn btn-primary btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  data-invoice-id={row[0]}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  data-invoice-id={row[0]}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
                <span className="d-flex align-items-center"
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

      {/* Modal Thêm Phân Công */}
      <div className="modal fade" id="addModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm Phân Công</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {/* Chọn Người */}
              <div className="mb-3">
                <label className="form-label">Người</label>
                <SelectWithScroll
                  options={["Tất cả", ...dataNguoiDung.map(u => `${u.id}: ${u.name}`)]}
                  value={nguoiEdit ? `${nguoiEdit}: ${dataNguoiDung.find(u => u.id === nguoiEdit)?.name}` : "Tất cả"}
                  onChange={val => setNguoiEdit(val === "Tất cả" ? "" : val.split(":")[0])}
                />
              </div>

              {/* Chọn Ca */}
              <div className="mb-3">
                <label className="form-label">Ca</label>
                <SelectWithScroll
                  options={["Tất cả", ...dataThoiGianBieu.map(c => `${c.id}: ${c.name}`)]}
                  value={caEdit ? `${caEdit}: ${dataThoiGianBieu.find(c => c.id === caEdit)?.name}` : "Tất cả"}
                  onChange={val => setCaEdit(val === "Tất cả" ? "" : val.split(":")[0])}
                />
              </div>

              {/* Ngày làm */}
              <div className="mb-3">
                <label className="form-label">Ngày làm</label>
                <input
                  type="date"
                  className="form-control"
                  value={ngayEdit || new Date().toISOString().slice(0, 10)}
                  onChange={e => setNgayEdit(e.target.value)}
                />
              </div>

              {/* Trạng thái */}
              <div className="mb-3">
                <label className="form-label">Trạng thái</label>
                <SelectWithScroll
                  options={["Đã phân công", "Hoàn thành", "Vắng"]}
                  value={trangThaiEdit || "Đã phân công"}
                  onChange={val => setTrangThaiEdit(val)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button
                className="btn btn-success"
                data-bs-dismiss="modal"
              >
                Thêm mới
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Modal Sửa */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa Hóa Đơn</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {currentInvoice ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Thu ngân</label>
                    <SelectWithScroll
                      options={["Tất cả", ...dataNguoiDung.map(u => `${u.id}: ${u.name}`)]}
                      value={currentInvoice?.createdBy?.id 
                              ? `${currentInvoice.createdBy.id}: ${currentInvoice.createdBy.name}` 
                              : "Tất cả"}
                      onChange={val => setThuNganEdit(val === "Tất cả" ? "" : val.split(":")[0])}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phương thức thanh toán</label>
                    <SelectWithScroll
                      options={["Tất cả", "Tiền mặt", "Chuyển khoản", "Thẻ ngân hàng"]}
                      value={currentInvoice.paymentMethod || "Tất cả"}
                      onChange={val => setPhuongThucEdit(val === "Tất cả" ? "" : val)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Trạng thái</label>
                    <SelectWithScroll
                      options={["Tất cả", "Đã thanh toán", "Đã hủy", "Chưa thanh toán"]}
                      value={currentInvoice.status || "Tất cả"}
                      onChange={val => setTrangThaiEdit(val === "Tất cả" ? "" : val)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tổng tiền</label>
                    <input
                      type="number"
                      className="form-control"
                      value={currentInvoice.totalAmount || 0}
                      onChange={e => setTongTienEdit(Number(e.target.value))}
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
              {currentInvoice ? (
                <p>Bạn có chắc muốn xóa hóa đơn <strong>{currentInvoice.id}</strong>?</p>
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

export default HoaDon;
