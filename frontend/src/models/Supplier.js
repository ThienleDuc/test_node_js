// src/models/Supplier.js
export default class Supplier {
  constructor(id, name, address, phone, createdAt) {
    this._id = id;
    this._name = name;
    this._address = address;
    this._phone = phone;
    this._createdAt = createdAt;
  }

  // ===== Getter =====
  get id() { return this._id; }
  get name() { return this._name; }
  get address() { return this._address; }
  get phone() { return this._phone; }
  get createdAt() { return this._createdAt; }

  // ===== Setter =====
  set name(value) { this._name = value; }
  set address(value) { this._address = value; }
  set phone(value) { this._phone = value; }
}
