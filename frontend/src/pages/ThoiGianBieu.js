// src/pages/ThoiGianBieu.jsx
import React, { useState, useEffect, useMemo } from "react";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import { getShiftsByFilter, getShiftById } from "../data/dataThoiGianBieu";

function ThoiGianBieu() {
  // --- Filter ---
  const [filterName, setFilterName] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("");

  // --- Modal state ---
  const [currentShift, setCurrentShift] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editTrangThai, setEditTrangThai] = useState("");
  const [editGhiChu, setEditGhiChu] = useState("");

  const columns = [
    "Mã ca",
    "Tên ca",
    "Bắt đầu",
    "Kết thúc",
    "Số giờ",
    "Đơn giá",
    "Tổng tiền",
    "Trạng thái",
    "Tác vụ"
  ];

  // --- FILTERED DATA ---
  const filteredData = useMemo(() => {
    return getShiftsByFilter({
      name: filterName,
      trangThai: filterTrangThai
    });
  }, [filterName, filterTrangThai]);

  // Khi mở modal
  useEffect(() => {
    const editEl = document.getElementById("editModalShift");
    const delEl = document.getElementById("deleteModalShift");

    const handleShow = (e) => {
      const btn = e.relatedTarget;
      const id = btn?.getAttribute("data-id");
      if (!id) return;

      const shift = getShiftById(id);
      setCurrentShift(shift);

      if (btn.dataset.bsTarget === "#editModalShift") {
        setEditName(shift.name);
        setEditStart(shift.startTime);
        setEditEnd(shift.endTime);
        setEditTrangThai(shift.trangThai);
        setEditGhiChu(shift.ghiChu);
      }
    };

    editEl?.addEventListener("show.bs.modal", handleShow);
    delEl?.addEventListener("show.bs.modal", handleShow);

    return () => {
      editEl?.removeEventListener("show.bs.modal", handleShow);
      delEl?.removeEventListener("show.bs.modal", handleShow);
    };
  }, []);

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Thời Gian Biểu</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Danh sách các ca làm việc.</p>
        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addModalShift">
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* FILTER */}
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label className="form-label">Tên ca</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên ca..."
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Trạng thái</label>
          <SelectWithScroll
            options={["Tất cả", "Hoạt động", "Ngưng"]}
            value={filterTrangThai === "" ? "Tất cả" : filterTrangThai}
            onChange={val => setFilterTrangThai(val === "Tất cả" ? "" : val)}
          />
        </div>
      </div>

      {/* TABLE */}
      <TableComponent
        title="Danh sách ca làm việc"
        columns={columns}
        data={filteredData.map(c => [
          c.id,
          c.name,
          c.startTime,
          c.endTime,
          c.soGio,
          c.donGia,
          c.tongTien,
          c.trangThai
        ])}
        renderCell={(cell, col, row) => {
          if (col === "Tác vụ") {
            const id = row[0];
            return (
              <td className="d-flex gap-1">
                <button
                  className="btn btn-primary btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#editModalShift"
                  data-id={id}
                >
                  <i className="fas fa-edit"></i>
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModalShift"
                  data-id={id}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            );
          }
          return <td>{cell}</td>;
        }}
      />
      {/* --- Modal Thêm --- */}
      <div className="modal fade" id="addModalShift" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Thêm Ca Làm</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <form id="addShiftForm">
                <div className="row">

                  {/* --------- Cột 1 --------- */}
                  <div className="col-md-6">

                    <div className="mb-3">
                      <label className="form-label">Tên ca</label>
                      <input type="text" className="form-control" name="name" placeholder="Nhập tên ca..." />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Giờ bắt đầu</label>
                      <input type="time" className="form-control" name="startTime" />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Giờ kết thúc</label>
                      <input type="time" className="form-control" name="endTime" />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Số giờ</label>
                      <input type="number" className="form-control" name="soGio" placeholder="Tự động tính" disabled />
                    </div>

                  </div>

                  {/* --------- Cột 2 --------- */}
                  <div className="col-md-6">

                    <div className="mb-3">
                      <label className="form-label">Đơn giá (VND/giờ)</label>
                      <input type="number" className="form-control" name="donGia" placeholder="Nhập đơn giá..." />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Tổng tiền</label>
                      <input type="number" className="form-control" name="tongTien" placeholder="Tự động tính" disabled />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Ngày tạo</label>
                      <input type="date" className="form-control" name="ngayTao" value={new Date().toISOString().slice(0, 10)} />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Trạng thái</label>
                      <select className="form-control" name="trangThai">
                        <option value="Hoạt động">Hoạt động</option>
                        <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                      </select>
                    </div>

                  </div>

                </div>

                {/* Ghi chú (full width) */}
                <div className="mb-3">
                  <label className="form-label">Ghi chú</label>
                  <textarea className="form-control" name="ghiChu" rows="2"></textarea>
                </div>

              </form>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-success" data-bs-dismiss="modal">Thêm mới</button>
            </div>

          </div>
        </div>
      </div>

      {/* --- Modal Sửa --- */}
      <div className="modal fade" id="editModalShift" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa Ca Làm</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {currentShift ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Tên ca</label>
                    <input
                      className="form-control"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Bắt đầu</label>
                    <input
                      type="time"
                      className="form-control"
                      value={editStart}
                      onChange={e => setEditStart(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Kết thúc</label>
                    <input
                      type="time"
                      className="form-control"
                      value={editEnd}
                      onChange={e => setEditEnd(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Trạng thái</label>
                    <SelectWithScroll
                      options={["Hoạt động", "Ngưng"]}
                      value={editTrangThai}
                      onChange={val => setEditTrangThai(val)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Ghi chú</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={editGhiChu}
                      onChange={e => setEditGhiChu(e.target.value)}
                    ></textarea>
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

      {/* --- Modal Xóa --- */}
      <div className="modal fade" id="deleteModalShift" tabIndex="-1">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xác nhận xóa</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {currentShift ? (
                <p>Bạn có chắc muốn xóa ca <strong>{currentShift.name}</strong>?</p>
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

export default ThoiGianBieu;
