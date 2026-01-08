// src/models/Revenue.js
export default class Revenue {
  constructor(
    invoiceId,
    invoiceDate,
    userId,
    userName,
    productId,
    productName,
    quantity,
    unitPrice,
    totalPrice
  ) {
    this._invoiceId = invoiceId;
    this._invoiceDate = invoiceDate;
    this._userId = userId;
    this._userName = userName;
    this._productId = productId;
    this._productName = productName;
    this._quantity = quantity;
    this._unitPrice = unitPrice;
    this._totalPrice = totalPrice;
  }

  // ===== Getter =====
  get invoiceId() { return this._invoiceId; }
  get invoiceDate() { return this._invoiceDate; }
  get userId() { return this._userId; }
  get userName() { return this._userName; }
  get productId() { return this._productId; }
  get productName() { return this._productName; }
  get quantity() { return this._quantity; }
  get unitPrice() { return this._unitPrice; }
  get totalPrice() { return this._totalPrice; }

  // ===== Setter =====
  set invoiceDate(value) { this._invoiceDate = value; }
  set userName(value) { this._userName = value; }
  set productName(value) { this._productName = value; }
  set quantity(value) { this._quantity = value; }
  set unitPrice(value) { this._unitPrice = value; }
  set totalPrice(value) { this._totalPrice = value; }
}
