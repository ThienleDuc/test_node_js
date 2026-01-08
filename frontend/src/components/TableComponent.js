import React, { useMemo, useState } from "react";

const TableComponent = ({
  title,
  columns = [],
  data = [],
  renderCell,
  defaultRowsPerPage = 5,
  hiddenColumns = [] // danh sách index cột ẩn
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
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={hiddenColumns.includes(idx) ? "d-none" : "text-nowrap"}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {columns.map((col, idx) => {
                    const cell = row[idx];
                    if (hiddenColumns.includes(idx)) {
                      return <td key={idx} className="d-none">{cell}</td>;
                    }
                    return renderCell
                      ? renderCell(cell, col, row, idx)
                      : <td key={idx}>{cell}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center mt-3">
              {/* Prev */}
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                  <i className="fas fa-angle-left"></i>
                </button>
              </li>

              {(() => {
                const pages = [];
                const maxPagesToShow = 10;

                if (totalPages <= maxPagesToShow) {
                  // Nếu <= 10 thì hiển thị tất cả
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  // Luôn hiển thị đầu 5 trang
                  for (let i = 1; i <= 5; i++) pages.push(i);

                  // Thêm dấu ... nếu currentPage > 5
                  if (currentPage > 5 && currentPage < totalPages - 4) {
                    pages.push("...");
                    pages.push(currentPage - 1, currentPage, currentPage + 1);
                    pages.push("...");
                  } else {
                    pages.push("...");
                  }

                  // Luôn hiển thị cuối 5 trang
                  for (let i = totalPages - 4; i <= totalPages; i++) {
                    if (!pages.includes(i)) pages.push(i);
                  }
                }

                return pages.map((num, idx) => {
                  if (num === "...") return (
                    <li key={idx} className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  );

                  return (
                    <li key={idx} className={`page-item ${currentPage === num ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(num)}>
                        {num}
                      </button>
                    </li>
                  );
                });
              })()}

              {/* Next */}
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

export default TableComponent;
