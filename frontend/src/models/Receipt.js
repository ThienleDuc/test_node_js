export default class Receipt {
  constructor(id, date, supplier, employee, total, unit = "VNĐ") {
    this._id = id;
    this._date = date;
    this._supplier = supplier;   // object Supplier
    this._employee = employee;   // object User
    this._total = total;
    this._unit = unit;           // đơn vị tính
  }

  // --- Getter ---
  get id() {
    return this._id;
  }

  get date() {
    return this._date;
  }

  get supplier() {
    return this._supplier;
  }

  get employee() {
    return this._employee;
  }

  get total() {
    return this._total;
  }

  get unit() {
    return this._unit;
  }

  // --- Setter ---
  set id(value) {
    this._id = value;
  }

  set date(value) {
    this._date = value;
  }

  set supplier(value) {
    this._supplier = value;
  }

  set employee(value) {
    this._employee = value;
  }

  set total(value) {
    this._total = value;
  }

  set unit(value) {
    this._unit = value;
  }
}
