// src/pages/NguoiDung.jsx
import React, { useState, useEffect, useCallback } from "react";
import ObjectTableComponent from "../components/ObjectTableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import PasswordInput from "../components/PasswordInput";
import Swal from "sweetalert2";
import {
  getAllNguoiDung,
  createNguoiDung,
  updateNguoiDung,
  deleteNguoiDung,
  searchNguoiDung,
} from "../api/nguoiDung.api";
import { getAllVaiTro } from "../api/vaiTro.api";

function NguoiDung() {
  const [roles, setRoles] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await getAllVaiTro();
      const data = res?.data || [];

      setRoles(data); // lưu object
      setRoleOptions(data.map(r => r.TenVaiTro)); // chỉ lấy tên
    } catch (err) {
      console.error("Lỗi lấy danh sách vai trò:", err);
      setRoles([]);
      setRoleOptions([]);
    }
  }, []);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const [statusOptions] = useState([
    { id: true, label: "Hoạt động" },
    { id: false, label: "Khóa" }
  ]);

  const [, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // dữ liệu đã lọc
  
  const fetchUsers = async () => {
    try {
      const res = await getAllNguoiDung(); // trả về object
      console.log("API NguoiDung trả về:", res);
      const usersData = res.data || []; // lấy mảng trong object

      setUsers(usersData);
      setFilteredUsers(usersData); // khởi tạo filtered
    } catch (err) {
      console.error("Lỗi fetchUsers:", err);
    }
  };

  // Gọi khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter
  const [filterName, setFilterName] = useState("");
  const [filterRoleId, setFilterRoleId] = useState("");
  const [filterRoleName, setFilterRoleName] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("");

 // --- handleSearch dùng useCallback ---
  const handleSearch = useCallback(async () => {
    try {
      const params = {};
      if (filterName) params.HoTen = filterName;
      if (filterRoleId) params.MaVaiTro = filterRoleId;
      if (filterStatus !== "") params.TrangThai = filterStatus; // filterStatus là boolean hoặc 'true'/'false'

      const data = await searchNguoiDung(params);
      
      // Map dữ liệu nếu cần thêm label cho trạng thái và tên vai trò
      const mapped = data.map(u => ({
        ...u,
        TrangThaiLabel: u.TrangThai ? "Hoạt động" : "Khóa",
        TenVaiTro: u.MaVaiTro?.TenVaiTro || ""
      }));

      setFilteredUsers(mapped);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm người dùng:", err);
      setFilteredUsers([]);
    }
  }, [filterName, filterRoleId, filterStatus]);

  // Gọi khi filter thay đổi
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const [currentRow, setCurrentRow] = useState(null);

  // Form Add/Edit
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRoleId, setEditRoleId] = useState("");
  const [editRoleName, setEditRoleName] = useState("");
  const [editStatus, setEditStatus] = useState(true);

  // --- Handlers ---
  const clearForm = () => {
    setEditName("");
    setEditEmail("");
    setEditPassword("");
    setEditRoleId("");
    setEditRoleName("");
    setEditStatus(true);
  };

  const handleAddUser = async () => {
    try {
      await createNguoiDung({
        HoTen: editName,
        Email: editEmail,
        MatKhau: editPassword,
        TrangThai: editStatus,
        MaVaiTro: editRoleId
      });

      await fetchUsers();
      clearForm();

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Thêm người dùng thành công",
        timer: 1500,
        showConfirmButton: false
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.response?.data?.message || err.message,
        confirmButtonColor: "#dc3545"
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!currentRow?._id) return;

    try {
      await updateNguoiDung(currentRow._id, {
        HoTen: editName,
        Email: editEmail,
        MatKhau: editPassword || undefined, // không đổi mật khẩu nếu rỗng
        TrangThai: editStatus,
        MaVaiTro: editRoleId
      });

      await fetchUsers();
      setCurrentRow(null);
      clearForm();

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật người dùng thành công",
        timer: 1500,
        showConfirmButton: false
      });

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.response?.data?.message || err.message,
        confirmButtonColor: "#dc3545"
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!currentRow?._id) return;
    try {
      await deleteNguoiDung(currentRow._id);
      await fetchUsers();
      setCurrentRow(null);
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Xóa bỏ người dùng thành công",
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.response?.data?.message || err.message,
        confirmButtonColor: "#dc3545"
      });
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Người dùng</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Danh sách người dùng hiển thị dưới đây.</p>
        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addModal">
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* Filter */}
      <div className="row g-2 mb-3 align-items-end">
        <div className="col-md-4">
          <label className="form-label">Tên người dùng</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên..."
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Vai trò</label>
          <SelectWithScroll
            options={["Tất cả", ...roleOptions]} // roleOptions là mảng tên vai trò
            value={filterRoleName}
            onChange={val => {
              if (val === "Tất cả") {
                setFilterRoleId("");          // không filter role
                setFilterRoleName("Tất cả");  // hiển thị "Tất cả"
              } else {
                // Tìm object vai trò dựa trên tên
                const role = roles.find(r => r.TenVaiTro === val);
                if (!role) {
                  console.error("Role không tồn tại:", val);
                  return;
                }
                setFilterRoleId(role._id);   // lưu _id thực tế để filter
                setFilterRoleName(role.TenVaiTro); // hiển thị label
              }
            }}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Trạng thái</label>
          <SelectWithScroll
            options={["Tất cả", ...statusOptions.map(s => s.label)]} 
            value={filterStatus === "" ? "Tất cả" : statusOptions.find(s => s.id === filterStatus)?.label || "Tất cả"}
            onChange={val => {
              if (val === "Tất cả") {
                setFilterStatus(""); // bỏ filter
              } else {
                const status = statusOptions.find(s => s.label === val);
                if (!status) {
                  console.error("Status không tồn tại:", val);
                  return;
                }
                setFilterStatus(status.id); // lưu giá trị thực (id)
              }
            }}
          />
        </div>
      </div>

      {/* Table */}
      <ObjectTableComponent
        title="Danh sách người dùng"
        columns={[
          { key: "_index", label: "#" },
          { key: "HoTen", label: "Họ tên" },
          { key: "Email", label: "Email" },
          { key: "TrangThaiLabel", label: "Trạng thái" },
          { key: "TenVaiTro", label: "Vai trò" },
          { key: "actions", label: "Tác vụ" },
        ]}
        data={filteredUsers.map((u, index) => ({ ...u, _index: index + 1 }))}
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
                      setEditName(row.HoTen);
                      setEditEmail(row.Email);
                      setEditPassword("");
                      setEditRoleId(row.MaVaiTro || "");
                      setEditRoleName(row.TenVaiTro || "");
                      setEditStatus(row.TrangThai);
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

          if (key === "TrangThaiLabel") {
            return (
              <td key={key}>
                <span className={`badge ${cell === "Hoạt động" ? "bg-success" : "bg-secondary"}`}>
                  {cell}
                </span>
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
              <h5 className="modal-title">Thêm mới người dùng</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                {/* Hàng 1: Họ tên & Email */}
                <div className="col-md-6">
                  <label className="form-label">Họ tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                  />
                </div>

                {/* Hàng 2: Mật khẩu chiếm cả cột */}
                <div className="col-12">
                  <label className="form-label">Mật khẩu</label>
                  <PasswordInput
                    type="text"
                    className="form-control"
                    value={editPassword}
                    onChange={e => setEditPassword(e.target.value)}
                  />
                </div>

                {/* Hàng 3: Vai trò & Trạng thái */}
                <div className="col-md-6">
                  <label className="form-label">Vai trò</label>
                  <SelectWithScroll
                    options={roles.map(r => r.TenVaiTro)} 
                    value={editRoleName}                  
                    onChange={val => {
                      const role = roles.find(r => r.TenVaiTro === val);
                      if (!role) return;                   
                      setEditRoleId(role._id);             
                      setEditRoleName(role.TenVaiTro);    
                    }}
                    placeholder="Chọn vai trò"
                  />

                </div>
                <div className="col-md-6">
                  <label className="form-label">Trạng thái</label>
                  <input
                    type="text"
                    className="form-control"
                    value={statusOptions.find(s => s.id === editStatus)?.label || ""}
                    readOnly
                    style={{ backgroundColor: "#e9ecef", cursor: "not-allowed" }}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-success" data-bs-dismiss="modal" onClick={handleAddUser}>Thêm mới</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa người dùng</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                {/* Hàng 1: Họ tên & Email */}
                <div className="col-md-6">
                  <label className="form-label">Họ tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                  />
                </div>

                {/* Hàng 2: Mật khẩu chiếm cả cột */}
                <div className="col-12">
                  <label className="form-label">Mật khẩu</label>
                  <PasswordInput
                    type="text"
                    className="form-control"
                    value={editPassword || ""}
                    onChange={e => setEditPassword(e.target.value)}
                  />
                </div>

                {/* Hàng 3: Vai trò & Trạng thái */}
                <div className="col-md-6">
                  <label className="form-label">Vai trò</label>
                  <SelectWithScroll
                    options={roles.map(r => r.TenVaiTro)}
                    value={editRoleName}
                    onChange={val => {
                      const role = roles.find(r => r.TenVaiTro === val);
                      if (role) {
                        setEditRoleId(role._id);
                        setEditRoleName(role.TenVaiTro);
                      }
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Trạng thái</label>
                  <SelectWithScroll
                    options={statusOptions.map(s => s.label)}
                    value={statusOptions.find(s => s.id === editStatus)?.label || statusOptions[0].label}
                    onChange={val => {
                      const status = statusOptions.find(s => s.label === val);
                      if (!status) {
                        console.error("Status không tồn tại:", val);
                        return;
                      }
                      setEditStatus(status.id);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleUpdateUser}
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
              Bạn có chắc muốn xóa người dùng <strong>{currentRow?.HoTen}</strong> không?
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Không</button>
              <button className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDeleteUser} disabled={!currentRow}>Có</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NguoiDung;
