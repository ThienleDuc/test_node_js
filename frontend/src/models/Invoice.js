// src/models/Invoice.js
export default class Invoice {
  constructor(id, date, userId, userName, paymentMethod, totalAmount, status) {
    this._id = id;
    this._date = date;
    this._userId = userId;
    this._userName = userName;
    this._paymentMethod = paymentMethod;
    this._totalAmount = totalAmount;
    this._status = status;
  }

  // ===== Getter =====
  get id() { return this._id; }
  get date() { return this._date; }
  get userId() { return this._userId; }
  get userName() { return this._userName; }
  get paymentMethod() { return this._paymentMethod; }
  get totalAmount() { return this._totalAmount; }
  get status() { return this._status; }

  // ===== Setter =====
  set date(value) { this._date = value; }
  set userName(value) { this._userName = value; }
  set paymentMethod(value) { this._paymentMethod = value; }
  set totalAmount(value) { this._totalAmount = value; }
  set status(value) { this._status = value; }
}
