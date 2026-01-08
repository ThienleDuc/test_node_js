// exportExcel.js
import * as XLSX from "xlsx";

/**
 * Xuất dữ liệu ra file Excel
 * @param {Array} data - Mảng dữ liệu, có thể là array of objects hoặc array of arrays
 * @param {Array} columns - Nếu data là array of arrays, truyền mảng tên cột
 * @param {String} fileName - Tên file xuất ra
 */
export const exportExcel = (data, columns = [], fileName = "Export.xlsx") => {
  let ws;

  if (data.length === 0) {
    ws = XLSX.utils.json_to_sheet([]);
  } else {
    // Nếu là array of arrays
    if (Array.isArray(data[0])) {
      // Nếu columns có, thêm hàng header
      const dataWithHeader = columns.length ? [columns, ...data] : data;
      ws = XLSX.utils.aoa_to_sheet(dataWithHeader);
    } else {
      // Nếu là array of objects
      ws = XLSX.utils.json_to_sheet(data);
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  XLSX.writeFile(wb, fileName);
};
