// src/pages/PhanCong.jsx
import React, { useState, useEffect, useMemo } from "react";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import { useSession } from "../contexts/SessionContext";
import { dataNguoiDung } from "../data/dataNguoiDung";
import { dataThoiGianBieu } from "../data/dataThoiGianBieu";
import { getAssignmentsByFilter, getAssignmentById } from "../data/dataPhanCong";

function PhanCong() {
  const { session } = useSession();

  // Filter
  const [filterNgay, setFilterNgay] = useState("");
  const [filterNguoi, setFilterNguoi] = useState("");
  const [filterCa, setFilterCa] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("");

  // Modal state
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [nguoiEdit, setNguoiEdit] = useState("");
  const [caEdit, setCaEdit] = useState("");
  const [ngayEdit, setNgayEdit] = useState("");
  const [trangThaiEdit, setTrangThaiEdit] = useState("");

  const columns = ["ID", "Ngày làm", "Nhân viên", "Ca", "Trạng thái", "Tác vụ"];

  // Filter dữ liệu
  const filteredData = useMemo(() => {
    const assignments = getAssignmentsByFilter({
      userId: filterNguoi,
      shiftId: filterCa,
      workDate: filterNgay,
      status: filterTrangThai,
      assignedById: session.id
    });

    return assignments;
  }, [filterNguoi, filterCa, filterNgay, filterTrangThai, session.id]);

  // Modal
  useEffect(() => {
    const editModalEl = document.getElementById("editModal");
    const deleteModalEl = document.getElementById("deleteModal");
    const addModalEl = document.getElementById("addModal");

    const handleShow = (event) => {
      const button = event.relatedTarget;
      const id = button.getAttribute("data-id");
      if (!id && button.dataset.bsTarget !== "#addModal") return;
      const assignment = id ? getAssignmentById(id) : null;

      if (button.dataset.bsTarget === "#editModal" && assignment) {
        setCurrentAssignment(assignment);
        setNguoiEdit(String(assignment.user?.id || ""));
        setCaEdit(String(assignment.shift?.id || ""));
        setNgayEdit(assignment.workDate || "");
        setTrangThaiEdit(assignment.status || "");
      } else if (button.dataset.bsTarget === "#deleteModal" && assignment) {
        setCurrentAssignment(assignment);
      } else if (button.dataset.bsTarget === "#addModal") {
        setCurrentAssignment(null);
        setNguoiEdit("");
        setCaEdit("");
        setNgayEdit("");
        setTrangThaiEdit("");
      }
    };

    if (editModalEl) editModalEl.addEventListener("show.bs.modal", handleShow);
    if (deleteModalEl) deleteModalEl.addEventListener("show.bs.modal", handleShow);
    if (addModalEl) addModalEl.addEventListener("show.bs.modal", handleShow);

    return () => {
      if (editModalEl) editModalEl.removeEventListener("show.bs.modal", handleShow);
      if (deleteModalEl) deleteModalEl.removeEventListener("show.bs.modal", handleShow);
      if (addModalEl) addModalEl.removeEventListener("show.bs.modal", handleShow);
    };
  }, []);

  // Helper function
  const getNguoiName = (id) => dataNguoiDung.find(u => u.id === id)?.name || "";
  const getCaName = (id) => dataThoiGianBieu.find(c => c.id === id)?.name || "";

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Phân Công</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Danh sách phân công nhân viên.</p>
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
          <label className="form-label">Ngày làm</label>
          <input
            type="date"
            className="form-control"
            value={filterNgay}
            onChange={e => setFilterNgay(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Nhân viên</label>
          <SelectWithScroll
            options={["Tất cả", ...dataNguoiDung.map(u => `${u.id}: ${u.name}`)]}
            value={filterNguoi === "" ? "Tất cả" : `${filterNguoi}: ${getNguoiName(filterNguoi)}`}
            onChange={val => setFilterNguoi(val === "Tất cả" ? "" : val.split(":")[0])}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Ca</label>
          <SelectWithScroll
            options={["Tất cả", ...dataThoiGianBieu.map(c => `${c.id}: ${c.name}`)]}
            value={filterCa === "" ? "Tất cả" : `${filterCa}: ${getCaName(filterCa)}`}
            onChange={val => setFilterCa(val === "Tất cả" ? "" : val.split(":")[0])}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Trạng thái</label>
          <SelectWithScroll
            options={["Tất cả", "Đã phân công", "Hoàn thành", "Vắng"]}
            value={filterTrangThai || "Tất cả"}
            onChange={val => setFilterTrangThai(val === "Tất cả" ? "" : val)}
          />
        </div>
      </div>

      {/* Table */}
      <TableComponent
        title="Danh sách Phân Công"
        columns={columns}
        data={filteredData.map(a => [
          a.id,
          a.workDate || "",
          getNguoiName(a.user?.id),
          getCaName(a.shift?.id),
          a.status || ""
        ])}
        renderCell={(cell, column, row) => {
          if (column === "Tác vụ") {
            return (
              <td className="d-flex gap-1">
                <button
                  className="btn btn-primary btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  data-id={row[0]}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  data-id={row[0]}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            );
          }
          return <td>{cell}</td>;
        }}
      />

      {/* Modal Thêm */}
      <div className="modal fade" id="addModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm Phân Công</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nhân viên</label>
                <SelectWithScroll
                  options={dataNguoiDung.map(u => `${u.id}: ${u.name}`)}
                  value={nguoiEdit ? `${nguoiEdit}: ${getNguoiName(nguoiEdit)}` : ""}
                  onChange={val => setNguoiEdit(val.split(":")[0])}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Ca</label>
                <SelectWithScroll
                  options={dataThoiGianBieu.map(c => `${c.id}: ${c.name}`)}
                  value={caEdit ? `${caEdit}: ${getCaName(caEdit)}` : ""}
                  onChange={val => setCaEdit(val.split(":")[0])}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Ngày làm</label>
                <input type="date" className="form-control" value={ngayEdit} onChange={e => setNgayEdit(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Trạng thái</label>
                <SelectWithScroll
                  options={["Đã phân công", "Hoàn thành", "Vắng"]}
                  value={trangThaiEdit}
                  onChange={val => setTrangThaiEdit(val)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button type="button" className="btn btn-primary">Lưu</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Sửa */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Sửa Phân Công</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nhân viên</label>
                <SelectWithScroll
                  options={dataNguoiDung.map(u => `${u.id}: ${u.name}`)}
                  value={nguoiEdit ? `${nguoiEdit}: ${getNguoiName(nguoiEdit)}` : ""}
                  onChange={val => setNguoiEdit(val.split(":")[0])}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Ca</label>
                <SelectWithScroll
                  options={dataThoiGianBieu.map(c => `${c.id}: ${c.name}`)}
                  value={caEdit ? `${caEdit}: ${getCaName(caEdit)}` : ""}
                  onChange={val => setCaEdit(val.split(":")[0])}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Ngày làm</label>
                <input type="date" className="form-control" value={ngayEdit} onChange={e => setNgayEdit(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Trạng thái</label>
                <SelectWithScroll
                  options={["Đã phân công", "Hoàn thành", "Vắng"]}
                  value={trangThaiEdit}
                  onChange={val => setTrangThaiEdit(val)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button type="button" className="btn btn-primary">Lưu</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Xóa */}
      <div className="modal fade" id="deleteModal" tabIndex="-1">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xóa Phân Công</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              Bạn có chắc muốn xóa phân công này không?
              <div className="mt-2">
                <strong>ID: </strong> {currentAssignment?.id}<br/>
                <strong>Nhân viên: </strong> {getNguoiName(currentAssignment?.user?.id)}<br/>
                <strong>Ca: </strong> {getCaName(currentAssignment?.shift?.id)}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button type="button" className="btn btn-danger">Xóa</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default PhanCong;
