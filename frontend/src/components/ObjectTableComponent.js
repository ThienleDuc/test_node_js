import React, { useMemo, useState } from "react";

const ObjectTableComponent = ({
  title,
  columns = [], // [{ key: "TenQuyen", label: "Tên quyền" }, ...]
  data = [],     // mảng object [{_id, TenQuyen, MoTa}, ...]
  renderCell,    // callback tuỳ chỉnh cell
  defaultRowsPerPage = 5,
  hiddenColumns = [] // danh sách key cột ẩn
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, currentPage, rowsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="card mb-4">
      {title && (
        <div className="card-header">
          <i className="fas fa-list me-1"></i> {title}
        </div>
      )}
      <div className="card-body">
        {data.length > 5 && (
          <div className="d-flex justify-content-start mb-3">
            <select
              className="form-select form-select-sm w-auto"
              value={rowsPerPage}
              onChange={e => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 15, 20].filter(n => n <= data.length).map(n => (
                <option key={n} value={n}>{n} dòng / trang</option>
              ))}
            </select>
          </div>
        )}

        <div className="table-responsive w-100" style={{ overflowX: "auto" }}>
          <table className="table table-bordered table-striped" style={{ minWidth: "100%" }}>
            <thead className="table-dark">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={hiddenColumns.includes(col.key) ? "d-none" : "text-nowrap"}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIdx) => (
                <tr key={row._id || rowIdx}>
                  {columns.map((col) => {
                    if (hiddenColumns.includes(col.key)) return <td key={col.key} className="d-none"></td>;

                    const cell = row[col.key];
                    return renderCell
                      ? renderCell(cell, col.key, row)
                      : <td key={col.key}>{cell}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center mt-3">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                  <i className="fas fa-angle-left"></i>
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <li key={num} className={`page-item ${currentPage === num ? "active" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(num)}>
                    {num}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                  <i className="fas fa-angle-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default ObjectTableComponent;
