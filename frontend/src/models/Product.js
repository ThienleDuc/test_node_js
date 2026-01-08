// src/models/Product.js
export default class Product {
  constructor(id, name, cost, sellPrice, quantity, unit, active, createdAt, supplierId, image) {
    this._id = id;
    this._name = name;
    this._cost = cost;
    this.price = sellPrice;
    this._quantity = quantity;
    this._unit = unit;
    this._active = active;
    this._createdAt = createdAt;
    this._supplierId = supplierId; // ID nhà cung cấp
    this._image = image;           // URL hoặc tên file ảnh
  }

  // Getter
  get id() { return this._id; }
  get name() { return this._name; }
  get cost() { return this._cost; }
  get sellPrice() { return this.price; }
  get quantity() { return this._quantity; }
  get unit() { return this._unit; }
  get active() { return this._active; }
  get createdAt() { return this._createdAt; }
  get supplierId() { return this._supplierId; }
  get image() { return this._image; }

  // Setter
  set name(value) { this._name = value; }
  set cost(value) { this._cost = value; }
  set sellPrice(value) { this.price = value; }
  set quantity(value) { this._quantity = value; }
  set unit(value) { this._unit = value; }
  set active(value) { this._active = value; }
  set supplierId(value) { this._supplierId = value; }
  set image(value) { this._image = value; }
}
