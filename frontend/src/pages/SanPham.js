// src/pages/SanPham.jsx
import React, { useState, useMemo, useEffect } from "react";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import { useSession } from "../contexts/SessionContext";
import { getRoleFlags } from "../utils/roleCheck";
import { getProductsByFilter, getProductById } from "../data/dataSanPham";
import { dataNhaCungCap, getSupplierById } from "../data/dataNhaCungCap";

function SanPham() {
  const { session } = useSession();
  const { isQuanLyCuaHang } = getRoleFlags(session?.role);

  const [searchName, setSearchName] = useState("");
  const [searchSupplier, setSearchSupplier] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [, setSelectedSupplierId] = useState(""); 
  const [selectedSupplierName, setSelectedSupplierName] = useState(""); 
  const [, setSelectedStatus] = useState("Hoạt động"); 
  const statusOptions = ["Hoạt động", "Ngưng bán"];

  // Form Add / Edit
  const [editForm, setEditForm] = useState({
    tenSP: "",
    giaNhap: "",
    giaBan: "",
    soLuong: "",
    donVi: "",
    trangThai: true,
  });

  const columns = [
    "Mã SP",
    "Tên sản phẩm",
    "Giá nhập",
    "Giá bán",
    "Số lượng",
    "Đơn vị",
    "Trạng thái",
    "Ngày tạo",
    "Nhà cung cấp",
    ...(isQuanLyCuaHang ? ["Tác vụ"] : [])
  ];

  // Lọc dữ liệu
  const filteredProducts = useMemo(() => {
    const safeName = searchName.trim();
    const safeSupplier = searchSupplier.trim();
    const safeStatus = searchStatus.trim();

    const data = getProductsByFilter({
      name: safeName,
      supplierName: safeSupplier,
      status: safeStatus
    });

    return data;
  }, [searchName, searchSupplier, searchStatus]);

  // Modal Edit: set dữ liệu khi mở modal
  useEffect(() => {
    const editModalEl = document.getElementById("editModal");
    if (!editModalEl) return;

    const handleShow = (event) => {
      const button = event.relatedTarget;
      const productId = button.getAttribute("data-product-id");
      if (!productId) return;

      const product = getProductById(productId); 
      if (!product) return;

      setEditForm({
        nameSP: product.name || "",
        giaNhap: product.cost || "",
        giaBan: product.price || "",
        soLuong: product.quantity || "",
        donVi: product.unit || ""
      });

      setSelectedSupplierId(product._supplierId);
      setSelectedSupplierName(getSupplierById(product._supplierId)?.name)
      setSelectedStatus(product.active);
    };

    editModalEl.addEventListener("show.bs.modal", handleShow);
    return () => editModalEl.removeEventListener("show.bs.modal", handleShow);
  }, []);

  // Modal Delete: set tên sản phẩm khi mở modal
  useEffect(() => {
    const deleteModalEl = document.getElementById("deleteModal");
    if (!deleteModalEl) return;

    const handleShow = (event) => {
      const button = event.relatedTarget;
      const productId = button.getAttribute("data-product-id");
      if (!productId) return;

      const product = getProductById(productId);
      if (!product) return;

      setEditForm(prev => ({ ...prev, tenSP: product.name || "" }));
    };

    deleteModalEl.addEventListener("show.bs.modal", handleShow);
    return () => deleteModalEl.removeEventListener("show.bs.modal", handleShow);
  }, []);


  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Sản phẩm</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Danh sách sản phẩm cửa hàng tiện lợi.</p>
        {isQuanLyCuaHang && (
          <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addModal">
            <i className="fas fa-plus me-1"></i> Thêm mới
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="row g-2 mb-3 align-items-end">
        <div className="col-md-4">
          <label className="form-label">Tên sản phẩm</label>
          <input type="text" className="form-control" placeholder="Nhập tên..." value={searchName} onChange={e => setSearchName(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Nhà cung cấp</label>
          <SelectWithScroll
            options={["Tất cả", ...dataNhaCungCap.map(s => s.name)]}
            value={searchSupplier || "Tất cả"}
            onChange={val => setSearchSupplier(val === "Tất cả" ? "" : val)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Trạng thái</label>
          <SelectWithScroll
            options={["Tất cả", ...statusOptions]}
            value={searchStatus || "Tất cả"}
            onChange={val => setSearchStatus(val === "Tất cả" ? "" : val)}
          />
        </div>
      </div>

      {/* Table */}
      <TableComponent
        title="Danh sách sản phẩm"
        columns={columns}
        data={filteredProducts.map(p => [
          p.id,
          p.name,
          p.cost,
          p.price,
          p.quantity,
          p.unit,
          p.active,
          p.createdAt,
          p.supplierName
        ])}
        renderCell={(cell, column, row) => {
          if (column === "Trạng thái") {
            return <td><span className={cell ? "badge bg-success" : "badge bg-secondary"}>{cell ? "Hoạt động" : "Ngưng bán"}</span></td>;
          }
          if (column === "Tác vụ" && isQuanLyCuaHang) {
            return (
              <td>
                <button className="btn btn-primary btn-sm me-1" data-bs-toggle="modal" data-bs-target="#editModal" data-product-id={row[0]}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal" data-product-id={row[0]}>
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
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm sản phẩm</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Tên sản phẩm</label>
                  <input type="text" className="form-control" value={editForm.tenSP} onChange={e => setEditForm({ ...editForm, tenSP: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Giá nhập</label>
                  <input type="number" className="form-control" value={editForm.giaNhap} onChange={e => setEditForm({ ...editForm, giaNhap: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Giá bán</label>
                  <input type="number" className="form-control" value={editForm.giaBan} onChange={e => setEditForm({ ...editForm, giaBan: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Số lượng</label>
                  <input type="number" className="form-control" value={editForm.soLuong} onChange={e => setEditForm({ ...editForm, soLuong: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Đơn vị</label>
                  <input type="text" className="form-control" value={editForm.donVi} onChange={e => setEditForm({ ...editForm, donVi: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Trạng thái</label>
                  <SelectWithScroll
                    options={["Hoạt động", "Ngưng bán"]}
                    value={editForm.trangThai ? "Hoạt động" : "Ngưng bán"}
                    onChange={val => setEditForm({ ...editForm, trangThai: val === "Hoạt động" })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Nhà cung cấp</label>
                  <SelectWithScroll
                    options={dataNhaCungCap.map(s => s.name)}
                    value={editForm.nhaCungCap}
                    onChange={val => setEditForm({ ...editForm, nhaCungCap: val })}
                  />
                </div>
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
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa sản phẩm</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Tên sản phẩm</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.tenSP}
                    onChange={e => setEditForm({ ...editForm, tenSP: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Giá nhập</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editForm.giaNhap}
                    onChange={e => setEditForm({ ...editForm, giaNhap: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Giá bán</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editForm.giaBan}
                    onChange={e => setEditForm({ ...editForm, giaBan: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Số lượng</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editForm.soLuong}
                    onChange={e => setEditForm({ ...editForm, soLuong: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Đơn vị</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.donVi}
                    onChange={e => setEditForm({ ...editForm, donVi: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Trạng thái</label>
                  <SelectWithScroll
                    options={["Hoạt động", "Ngưng bán"]}
                    value={editForm.trangThai ? "Hoạt động" : "Ngưng bán"}
                    onChange={val => setEditForm({ ...editForm, trangThai: val === "Hoạt động" })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Nhà cung cấp</label>
                  <SelectWithScroll
                    options={dataNhaCungCap.map(s => s.name)}
                    value={selectedSupplierName}
                    onChange={val => {
                      const selectedRole = dataNhaCungCap.find(s => s.name === val);
                      if (selectedRole) {
                        setSelectedSupplierId(selectedRole.id);
                        setSelectedSupplierName(selectedRole.name);
                      }
                    }}
                  />
                </div>
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
              <p>Bạn có chắc muốn xóa sản phẩm <strong>{editForm.tenSP}</strong>?</p>
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

export default SanPham;
