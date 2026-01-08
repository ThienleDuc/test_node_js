// src/pages/VaiTro.jsx
import React, { useState, useMemo, useEffect } from "react";
import TableComponent from "../components/TableComponent";
import { Link } from "react-router-dom";
import { getRolesByFilter, getRoleById } from "../data/dataVaiTro";

function VaiTro() {
  const [searchName, setSearchName] = useState("");
  
  const [, setEditRoleId] = useState("");
  const [editRoleName, setEditRoleName] = useState("");
  const [editRoleDesc, setEditRoleDesc] = useState("");

  const columns = ["ID", "Tên vai trò", "Mô tả", "Tác vụ"];

  // Lọc dữ liệu
  const filteredRoles = useMemo(() => {
    const safeName = searchName.trim();
    return getRolesByFilter({ name: safeName });
  }, [searchName]);

  // set data-* cho modal Bootstrap
   // set data-* cho modal Bootstrap
  useEffect(() => {
    const editModal = document.getElementById("editModal");
    const deleteModal = document.getElementById("deleteModal");

    if (editModal) {
      const handleShow = (event) => {
        const button = event.relatedTarget;
        const roleId = button.getAttribute("data-role-id");

        if (!roleId) return;
        const role = getRoleById(roleId.toString());
        if (!role) return;

        setEditRoleId(role.id);
        setEditRoleName(role.name);
        setEditRoleDesc(role.description);
      };

      editModal.addEventListener("show.bs.modal", handleShow);
      return () => editModal.removeEventListener("show.bs.modal", handleShow);
    }

    if (deleteModal) {
      const handleShowDelete = (event) => {
        const button = event.relatedTarget;
        const roleNameElem = document.getElementById("deleteRoleName");
        roleNameElem.textContent = button.getAttribute("data-role-name");
      };
      deleteModal.addEventListener("show.bs.modal", handleShowDelete);
      return () => deleteModal.removeEventListener("show.bs.modal", handleShowDelete);
    }
  }, []);

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Vai Trò</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Danh sách vai trò hiển thị dưới đây.</p>
        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addModal">
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* Search Filter */}
      <div className="row g-2 mb-3 align-items-end">
        <div className="col-md-4">
          <label className="form-label">Tên vai trò</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên..."
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <TableComponent
        title="Danh sách Vai Trò"
        columns={columns}
        data={filteredRoles.map(r => [
          r.id,
          r.name,
          r.description
        ])}
        renderCell={(cell, column, row) => {
          if (column === "Tác vụ") {
            const role = row; // row là object
            if (!role) return <td></td>;

            return (
              <td className="d-flex gap-1">
                <Link
                    to={`/vai-tro/${row[0]}`} 
                    className="btn btn-info btn-sm"
                    title="Xem danh sách quyền"
                  >
                    <i className="fas fa-list"></i>
                </Link>

                <button
                  className="btn btn-primary btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  data-role-id={role[0]}
                >
                  <i className="fas fa-edit"></i>
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  data-role-id={role[0]}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            );
          }
          return <td>{cell}</td>;
        }}
      />

      {/* Modal Add */}
      <div className="modal fade" id="addModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm mới vai trò</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Tên vai trò</label>
                <input
                  type="text"
                  className="form-control"
                  value={editRoleName}
                  onChange={e => setEditRoleName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mô tả</label>
                <input
                  type="text"
                  className="form-control"
                  value={editRoleDesc}
                  onChange={e => setEditRoleDesc(e.target.value)}
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

      {/* Modal Edit */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa vai trò</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Tên vai trò</label>
                <input
                  type="text"
                  className="form-control"
                  value={editRoleName}
                  onChange={e => setEditRoleName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mô tả</label>
                <input
                  type="text"
                  className="form-control"
                  value={editRoleDesc}
                  onChange={e => setEditRoleDesc(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-primary" data-bs-dismiss="modal">Lưu</button>
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
              <p>Bạn có chắc muốn xóa vai trò <strong id="deleteRoleName"></strong>?</p>
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

export default VaiTro;
