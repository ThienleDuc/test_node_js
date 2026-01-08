// src/pages/ChiTietPhieuNhap.jsx
import React, { useState, useMemo, useEffect } from "react";
import TableComponent from "../components/TableComponent";
import Breadcrumb from "../components/Breadcrumb";
import { useParams } from "react-router-dom";
import { dataSanPham } from "../data/dataSanPham";
import { getPurchaseDetailFilter } from "../data/dataChiTietPhieuNhap";

const ChiTietPhieuNhap = () => {
  const { maPN } = useParams(); // Lấy mã phiếu nhập từ URL
  const pnDisplay = maPN || "";

  // States
  const [searchProduct, setSearchProduct] = useState("");
  const [currentRow, setCurrentRow] = useState(null);
  const [formData, setFormData] = useState({
    purchaseId: "",
    productId: "",
    quantity: 0,
    unitPrice: 0,
  });

  // Lọc dữ liệu
  const filteredData = useMemo(() => {
    return getPurchaseDetailFilter({
      maPN,
      productName: searchProduct,
    });
  }, [maPN, searchProduct]);

  const columns = ["Mã Sản Phẩm", "Tên Sản Phẩm", "Số Lượng", "Đơn Giá", "Tác vụ"];

  // Modal Edit
  useEffect(() => {
    const editModalEl = document.getElementById("editModal");
    if (!editModalEl) return;

    const handleShow = (event) => {
      const button = event.relatedTarget;
      const rowIndex = button.getAttribute("data-row-index");
      if (rowIndex === null) return;

      const row = filteredData[parseInt(rowIndex)];
      if (!row) return;

      setCurrentRow(row);
      setFormData({
        purchaseId: row.purchaseId,
        productId: row.productId,
        quantity: row.quantity,
        unitPrice: row.unitPrice,
      });
    };

    editModalEl.addEventListener("show.bs.modal", handleShow);
    return () => editModalEl.removeEventListener("show.bs.modal", handleShow);
  }, [filteredData]);

  const handleAddClick = () => {
    setFormData({ purchaseId: maPN, productId: "", quantity: 0, unitPrice: 0 });
    setCurrentRow(null);
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Chi Tiết Phiếu Nhập</h1>

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { name: "Phiếu Nhập", link: "/phieu-nhap" },
          { name: `Chi Tiết Phiếu Nhập ${pnDisplay}` },
        ]}
      />

      {/* Sub-title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">
          Danh sách chi tiết của phiếu nhập: <strong>{pnDisplay}</strong>
        </p>
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
          onClick={handleAddClick}
        >
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* Search */}
      <div className="mb-3" style={{ maxWidth: "300px" }}>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Tìm theo tên sản phẩm..."
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
        />
      </div>

      {/* Table */}
      <TableComponent
        title="Danh sách chi tiết phiếu nhập"
        columns={columns}
        data={filteredData.map((d) => [
          d.productId,
          d.productName,
          d.quantity,
          d.unitPrice,
        ])}
        renderCell={(cell, column, row, rowIndex) => {
          if (column === "Tác vụ") {
            return (
              <td>
                <button
                  className="btn btn-primary btn-sm me-1"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  data-row-index={rowIndex}
                >
                  <i className="fas fa-edit"></i>
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  data-row-index={rowIndex}
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
              <h5 className="modal-title">Thêm chi tiết phiếu nhập</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Phiếu nhập</label>
                <input type="text" className="form-control" value={pnDisplay} readOnly />
              </div>
              <div className="mb-3">
                <label className="form-label">Sản phẩm</label>
                <select
                  className="form-select"
                  value={formData.productId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, productId: e.target.value }))
                  }
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {dataSanPham.map((sp) => (
                    <option key={sp._id ?? sp[0]} value={sp._id ?? sp[0]}>
                      {sp._name ?? sp[1]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Số lượng</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, quantity: parseInt(e.target.value) }))
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Đơn giá</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.unitPrice}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, unitPrice: parseInt(e.target.value) }))
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={() => {
                  alert(`Thêm chi tiết: ${formData.productId}, SL: ${formData.quantity}`);
                }}
              >
                Thêm
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
              <h5 className="modal-title">Chỉnh sửa chi tiết phiếu nhập</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Phiếu nhập</label>
                <input type="text" className="form-control" value={pnDisplay} readOnly />
              </div>
              <div className="mb-3">
                <label className="form-label">Sản phẩm</label>
                <select
                  className="form-select"
                  value={formData.productId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, productId: e.target.value }))
                  }
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {dataSanPham.map((sp) => (
                    <option key={sp._id ?? sp[0]} value={sp._id ?? sp[0]}>
                      {sp._name ?? sp[1]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Số lượng</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, quantity: parseInt(e.target.value) }))
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Đơn giá</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.unitPrice}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, unitPrice: parseInt(e.target.value) }))
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => {
                  alert(`Cập nhật chi tiết: ${formData.productId}, SL: ${formData.quantity}`);
                }}
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
              <p>
                Bạn có chắc muốn xóa chi tiết sản phẩm{" "}
                <strong>{currentRow?.productName}</strong> của phiếu nhập{" "}
                <strong>{pnDisplay}</strong>?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Không</button>
              <button
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={() => {
                  alert(`Xóa chi tiết: ${currentRow?.productName}`);
                }}
              >
                Có
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChiTietPhieuNhap;
