// src/pages/ChiTietHoaDon.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import Breadcrumb from "../components/Breadcrumb";
import { getInvoiceDetailByHD, getInvoiceDetailFilter } from "../data/dataChiTietHoaDon";
import { dataSanPham } from "../data/dataSanPham";
import { FaSquare, FaCheckSquare } from "react-icons/fa";

export default function ChiTietHoaDon() {
  const { maHD } = useParams(); // Mã hóa đơn từ URL
  const hdDisplay = maHD;

  // States riêng cho từng input
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [currentRow, setCurrentRow] = useState(null);
  const [searchProduct, setSearchProduct] = useState("");

  // Lọc dữ liệu theo mã hóa đơn + search
  const filteredData = useMemo(() => {
    return getInvoiceDetailFilter({ maHD, productName: searchProduct });
  }, [maHD, searchProduct]);

  const columns = ["Mã sản phẩm","Sản phẩm", "Số lượng", "Đơn giá", "Thành tiền", "Tác vụ"];

  // Modal Edit / Delete
  useEffect(() => {
    const editModalEl = document.getElementById("editModal");
    const deleteModalEl = document.getElementById("deleteModal");

    const handleShow = (event) => {
      const button = event.relatedTarget;
      if (!button) return;

      const productId = button.getAttribute("data-product-id");
      if (!productId) return;

      const [row] = getInvoiceDetailByHD(maHD, productId);
      if (!row) return;

      if (button.dataset.bsTarget === "#editModal") {
        setCurrentRow(row);
        setProductId(row._productId);
        setQuantity(row._quantity);
        setUnitPrice(row._unitPrice);
      } else if (button.dataset.bsTarget === "#deleteModal") {
        setCurrentRow(row);
      }
    };

    if (editModalEl) editModalEl.addEventListener("show.bs.modal", handleShow);
    if (deleteModalEl) deleteModalEl.addEventListener("show.bs.modal", handleShow);

    return () => {
      if (editModalEl) editModalEl.removeEventListener("show.bs.modal", handleShow);
      if (deleteModalEl) deleteModalEl.removeEventListener("show.bs.modal", handleShow);
    };
  }, [maHD]);

  // Thêm mới
  const handleAddClick = () => {
    setProductId("");
    setQuantity("");
    setUnitPrice("");
    setCurrentRow(null);
  };

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
      newCheckedMap[r._productId] = newCheckAll;
    });
    setCheckedMap(newCheckedMap);
  };

  const totalSelectedAmount = filteredData.reduce((sum, r) => {
    if (checkedMap[r._productId]) {
      return sum + (parseInt(r._quantity) * parseFloat(r._unitPrice));
    }
    return sum;
  }, 0);

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Chi tiết Hóa đơn</h1>

      <Breadcrumb
        items={[
          { name: "Hóa đơn", link: "/hoa-don" },
          { name: "Chi tiết hóa đơn" }
        ]}
      />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Danh sách chi tiết hóa đơn</p>
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
          onClick={handleAddClick}
        >
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      <div className="mb-3" style={{ maxWidth: "300px" }}>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Tìm theo tên sản phẩm..."
          value={searchProduct}
          onChange={e => setSearchProduct(e.target.value)}
        />
      </div>

      <TableComponent
        title="Danh sách chi tiết hóa đơn"
        columns={columns}
        hiddenColumns={[0]}
        data={filteredData.map(d => [d._productId, d._productName, d._quantity, d._unitPrice, parseInt(d._quantity) * parseFloat(d._unitPrice)])}
        renderCell={(cell, column, row) => {
          if (column === "Tác vụ") {
            const isChecked = checkedMap[row[0]] || false;
            return (
              <td className="d-flex gap-1">
                <button
                  className="btn btn-primary btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  data-product-id={row[0]}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  data-product-id={row[0]}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
                <span
                  onClick={() => toggleChecked(row[0])}
                  style={{
                    cursor: "pointer",
                    color: isChecked ? "#28a745" : "#6c757d",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "1.2rem"
                  }}
                  title={isChecked ? "Đã chọn" : "Chưa chọn"}
                >
                  {isChecked ? <FaCheckSquare /> : <FaSquare />}
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
        <div>
          <strong>Tổng tiền đã chọn: </strong> {totalSelectedAmount} VNĐ
        </div>
      </div>

      {/* Modal Add */}
      <div className="modal fade" id="addModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm chi tiết hóa đơn</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3" hidden>
                <label className="form-label">Hóa đơn</label>
                <input type="text" className="form-control" value={hdDisplay} readOnly />
              </div>
              <div className="mb-3">
                <label className="form-label">Sản phẩm</label>
                <SelectWithScroll
                  options={["Tất cả", ...dataSanPham.map(sp => `${sp._id ?? sp[0]}: ${sp._name ?? sp[1]}`)]}
                  value={
                    productId
                      ? `${productId}: ${dataSanPham.find(sp => (sp._id ?? sp[0]) === productId)?._name ?? dataSanPham.find(sp => (sp._id ?? sp[0]) === productId)[1]}`
                      : "Tất cả"
                  }
                  onChange={val =>
                    setProductId(val === "Tất cả" ? "" : val.split(":")[0])
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Số lượng</label>
                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  onChange={e => setQuantity(parseInt(e.target.value))}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Đơn giá</label>
                <input
                  type="number"
                  className="form-control"
                  value={unitPrice}
                  onChange={e => setUnitPrice(parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={() => {
                  alert(`Thêm chi tiết: ${productId}, SL: ${quantity}, ĐG: ${unitPrice}`);
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
              <h5 className="modal-title">Chỉnh sửa chi tiết hóa đơn</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3" hidden>
                <label className="form-label">Hóa đơn</label>
                <input type="text" className="form-control" value={hdDisplay} readOnly />
              </div>
              <div className="mb-3">
                <label className="form-label">Sản phẩm</label>
                <SelectWithScroll
                  options={dataSanPham.map(sp => `${sp._id ?? sp[0]}: ${sp._name ?? sp[1]}`)}
                  value={
                    productId
                      ? `${productId}: ${dataSanPham.find(sp => (sp._id ?? sp[0]) === productId)?._name ?? dataSanPham.find(sp => (sp._id ?? sp[0]) === productId)[1]}`
                      : ""
                  }
                  onChange={val =>
                    setProductId(val === "" ? "" : val.split(":")[0])
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Số lượng</label>
                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  onChange={e => setQuantity(parseInt(e.target.value))}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Đơn giá</label>
                <input
                  type="number"
                  className="form-control"
                  value={unitPrice}
                  onChange={e => setUnitPrice(parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => {
                  alert(`Cập nhật chi tiết: ${productId}, SL: ${quantity}, ĐG: ${unitPrice}`);
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
                Bạn có chắc muốn xóa chi tiết sản phẩm <strong>{currentRow?.productName}</strong> của hóa đơn <strong>{hdDisplay}</strong>?
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
}
