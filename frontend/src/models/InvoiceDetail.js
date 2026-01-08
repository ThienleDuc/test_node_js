// src/models/InvoiceDetail.js
export default class InvoiceDetail {
  constructor(invoiceId, productId, productName, quantity, unitPrice, totalPrice) {
    this._invoiceId = invoiceId;     // MaHD
    this._productId = productId;     // MaSP
    this._productName = productName; // TenSP
    this._quantity = quantity;       // SoLuong
    this._unitPrice = unitPrice;     // DonGia
    this._totalPrice = totalPrice;   // ThanhTien
  }

  // ===== Getter =====
  get invoiceId() { return this._invoiceId; }
  get productId() { return this._productId; }
  get productName() { return this._productName; }
  get quantity() { return this._quantity; }
  get unitPrice() { return this._unitPrice; }
  get totalPrice() { return this._totalPrice; }

  // ===== Setter =====
  set productName(value) { this._productName = value; }
  set quantity(value) { 
    this._quantity = value; 
    this._totalPrice = this._quantity * this._unitPrice; // tự động cập nhật totalPrice
  }
  set unitPrice(value) { 
    this._unitPrice = value; 
    this._totalPrice = this._quantity * this._unitPrice; // tự động cập nhật totalPrice
  }
}
