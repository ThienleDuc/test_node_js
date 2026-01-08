// src/pages/DoanhThu.js
import React, { useState, useMemo } from "react";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import { useSession } from "../contexts/SessionContext";
import { getRoleFlags } from "../utils/roleCheck";
import { dataSanPham } from "../data/dataSanPham";
import { dataNguoiDung } from "../data/dataNguoiDung";
import { getRevenueByFilter } from "../data/dataDoanhThu";
import { FaSquare, FaCheckSquare } from "react-icons/fa";
import { exportExcel } from "../components/exportExcel";

function DoanhThu() {
  const { session } = useSession();
  const { isQuanLyCuaHang, isThuNgan } = getRoleFlags(session?.role);

  // Filter
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterSP, setFilterSP] = useState(""); // lưu productId
  const [filterNguoi, setFilterNguoi] = useState(""); // lưu userId

  // Checkbox
  const [checkedMap, setCheckedMap] = useState({});
  const [checkAll, setCheckAll] = useState(false);

  const columns = ["Mã HD", "Ngày lập", "Người lập", "Sản phẩm", "Số lượng", "Đơn giá", "Thành tiền", "Mã sản phẩm","Tác vụ"];

  // Lọc dữ liệu
  const filteredData = useMemo(() => {
    const revenues = getRevenueByFilter({
      fromDate: filterFromDate,
      toDate: filterToDate,
      productId: filterSP,
      userId: isThuNgan ? session?.id : filterNguoi
    });

    return revenues;
  }, [filterFromDate, filterToDate, filterSP, filterNguoi, session?.id, isThuNgan]);

  // Toggle checkbox từng dòng
  const toggleChecked = (key) => {
    setCheckedMap(prev => {
      const newChecked = { ...prev, [key]: !prev[key] };
      if (!newChecked[key]) setCheckAll(false);
      return newChecked;
    });
  };

  // Toggle checkbox chọn tất cả
  const toggleCheckAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);

    const newCheckedMap = {};
    filteredData.forEach(r => {
      newCheckedMap[r.invoiceId + "_" + r.productId] = newCheckAll;
    });
    setCheckedMap(newCheckedMap);
  };

  // Tổng tiền đã chọn
  const totalSelectedAmount = filteredData.reduce((sum, r) => {
    return checkedMap[r.invoiceId + "_" + r.productId] ? sum + r.totalPrice : sum;
  }, 0);

  // Xuất Excel
  const handleExportExcel = () => {
    const selectedData = filteredData
      .filter(r => checkedMap[r.invoiceId + "_" + r.productId])
      .map(r => ({
        "Mã HD": r.invoiceId,
        "Ngày lập": r.invoiceDate,
        "Người lập": r.userName,
        "Mã SP": r.productId,
        "Tên SP": r.productName,
        "Số lượng": r.quantity,
        "Đơn giá": r.unitPrice,
        "Thành tiền": r.totalPrice,
        "Mã sản phẩm": r.productId
      }));

    if (selectedData.length === 0) {
      alert("Vui lòng chọn ít nhất 1 bản ghi để xuất Excel!");
      return;
    }

    exportExcel(selectedData, [], `DoanhThu_${Date.now()}.xlsx`);
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Doanh Thu</h1>
      <p className="mb-3">Bảng dưới đây hiển thị doanh thu theo sản phẩm.</p>


      {/* Filter */}
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <label className="form-label">Từ ngày</label>
          <input
            type="date"
            className="form-control"
            value={filterFromDate}
            onChange={e => setFilterFromDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Đến ngày</label>
          <input
            type="date"
            className="form-control"
            value={filterToDate}
            onChange={e => setFilterToDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Sản phẩm</label>
          <SelectWithScroll
            options={["Tất cả", ...dataSanPham.map(sp => `${sp.id}: ${sp.name}`)]}
            value={filterSP === "" ? "Tất cả" : `${filterSP}: ${dataSanPham.find(sp => sp.id === filterSP)?._name}`}
            onChange={val => setFilterSP(val === "Tất cả" ? "" : val.split(":")[0])}
          />
        </div>
        {isQuanLyCuaHang && (
          <div className="col-md-3">
            <label className="form-label">Người lập</label>
            <SelectWithScroll
              options={["Tất cả", ...dataNguoiDung.map(u => `${u.id}: ${u.name}`)]}
              value={filterNguoi === "" ? "Tất cả" : `${filterNguoi}: ${dataNguoiDung.find(u => u.id === filterNguoi)?.name}`}
              onChange={val => setFilterNguoi(val === "Tất cả" ? "" : val.split(":")[0])}
            />
          </div>
        )}
      </div>

      {/* Table */}
      <TableComponent
        title="Danh sách Doanh Thu"
        columns={columns}
        hiddenColumns={[7]}
        data={filteredData.map(r => [
          r.invoiceId,
          r.invoiceDate,
          r.userName,
          r.productName,
          r.quantity,
          r.unitPrice,
          r.totalPrice,
          r.productId
        ])}
        renderCell={(cell, column, row) => {
          if (column === "Tác vụ") {
            const key = row[0] + "_" + row[7];
            const isChecked = checkedMap[key] || false;
            return (
              <td className="d-flex gap-1">
                <span
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
                  onClick={() => toggleChecked(key)}
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
    </div>
  );
}

export default DoanhThu;
