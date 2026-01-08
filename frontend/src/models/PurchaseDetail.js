// src/models/PurchaseDetail.js
export default class PurchaseDetail {
  constructor(purchaseId, productId, productName, quantity, unitPrice) {
    this._purchaseId = purchaseId;   // MaPN
    this._productId = productId;     // MaSP
    this._productName = productName; // TenSP
    this._quantity = quantity;       // SoLuong
    this._unitPrice = unitPrice;     // DonGia
  }

  // ===== Getter =====
  get purchaseId() { return this._purchaseId; }
  get productId() { return this._productId; }
  get productName() { return this._productName; }
  get quantity() { return this._quantity; }
  get unitPrice() { return this._unitPrice; }

  // ===== Setter =====
  set productName(value) { this._productName = value; }
  set quantity(value) { this._quantity = value; }
  set unitPrice(value) { this._unitPrice = value; }
}
