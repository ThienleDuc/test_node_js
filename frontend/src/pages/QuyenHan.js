// src/pages/QuyenHan.jsx
import React, { useState, useEffect, useCallback } from "react";
import ObjectTableComponent from "../components/ObjectTableComponent";

import {
  getAllQuyenHan,
  createQuyenHan,
  updateQuyenHan,
  deleteQuyenHan,
  searchQuyenHanByName
} from "../api/quyenHan.api";

function QuyenHan() {
  const [permissions, setPermissions] = useState([]); // mảng object
  const [currentRow, setCurrentRow] = useState(null);

  // Modal thêm/sửa
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [filterKeyword, setFilterKeyword] = useState("");

  // Lấy danh sách quyền hạn, giữ nguyên object
  const fetchQuyenHan = async () => {
    try {
      const res = await getAllQuyenHan();
      console.log("API trả về:", res.data);

      // lấy mảng từ object trả về
      const dataArray = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setPermissions(dataArray);
    } catch (error) {
      console.error(error);
    }
  };

  // Tìm kiếm
  const handleSearch = useCallback(async () => {
    try {
      const res = await searchQuyenHanByName(filterKeyword);
      setPermissions(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  }, [filterKeyword]);

  useEffect(() => {
    if (!filterKeyword.trim()) {
      fetchQuyenHan();
    } else {
      handleSearch();
    }
  }, [filterKeyword, handleSearch]);

  // Thêm mới
  const handleAdd = async () => {
    try {
      await createQuyenHan({
        TenQuyen: editName,
        MoTa: editDescription
      });
      fetchQuyenHan();
      setEditName("");
      setEditDescription("");
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  // Cập nhật
  const handleUpdateQuyenHan = async () => {
    if (!currentRow?._id) return;
    try {
      await updateQuyenHan(currentRow._id, {
        MoTa: editDescription
      });
      fetchQuyenHan();
      setCurrentRow(null);
    } catch (error) {
      console.error("Lỗi cập nhật quyền hạn:", error);
    }
  };

  // Xóa
  const handleDeleteQuyenHan = async () => {
    if (!currentRow?._id) return;
    try {
      await deleteQuyenHan(currentRow._id);
      fetchQuyenHan();
      setCurrentRow(null);
    } catch (error) {
      console.error("Lỗi xóa quyền hạn:", error);
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quyền hạn</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Danh sách quyền hạn hiển thị dưới đây.</p>
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
        >
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* Search */}
      <div className="mb-3" style={{ maxWidth: "300px" }}>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Tìm theo tên hoặc mô tả..."
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
        />
      </div>

      {/* Table */}
        <ObjectTableComponent
          title="Danh sách quyền hạn"
          columns={[
            { key: "_index", label: "#" }, // số thứ tự
            { key: "TenQuyen", label: "Tên quyền" },
            { key: "MoTa", label: "Mô tả" },
            { key: "actions", label: "Tác vụ" }
          ]}
          data={permissions.map((item, index) => ({ ...item, _index: index + 1 }))}
          renderCell={(cell, key, row) => {
            if (key === "actions") {
              return (
                <td key={row._id}>
                  <div className="d-flex gap-1 justify-content-center">
                    <button
                      className="btn btn-primary btn-sm me-1"
                      data-bs-toggle="modal"
                      data-bs-target="#editModal"
                      onClick={() => {
                        setCurrentRow(row);
                        setEditName(row.TenQuyen);
                        setEditDescription(row.MoTa);
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteModal"
                      onClick={() => setCurrentRow(row)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              );
            }
            return <td key={key}>{cell}</td>;
          }}
        />

      {/* Modal Add */}
      <div className="modal fade" id="addModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm mới quyền hạn</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Tên quyền</label>
                <input
                  type="text"
                  className="form-control"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mô tả</label>
                <input
                  type="text"
                  className="form-control"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Hủy
              </button>
              <button className="btn btn-success" data-bs-dismiss="modal" onClick={handleAdd}>
                Thêm mới
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa quyền hạn</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Tên quyền</label>
                <input type="text" className="form-control" value={editName} readOnly />
              </div>
              <div className="mb-3">
                <label className="form-label">Mô tả</label>
                <input
                  type="text"
                  className="form-control"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Hủy
              </button>
              <button
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleUpdateQuyenHan}
                disabled={!currentRow}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Delete */}
      <div className="modal fade" id="deleteModal" tabIndex="-1">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xác nhận xóa</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              Bạn có chắc muốn xóa quyền hạn <strong>{currentRow?.TenQuyen}</strong> không?
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Không
              </button>
              <button
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={handleDeleteQuyenHan}
                disabled={!currentRow}
              >
                Có
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuyenHan;
