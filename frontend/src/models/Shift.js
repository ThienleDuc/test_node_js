// src/models/Shift.js
export default class Shift {
  constructor(id, name, timeStart, timeEnd, hours, salaryPerHour, salaryTotal, createdAt, status, note) {
    this._id = id;
    this._name = name;
    this._timeStart = timeStart;
    this._timeEnd = timeEnd;
    this._hours = hours;
    this._salaryPerHour = salaryPerHour;
    this._salaryTotal = salaryTotal;
    this._createdAt = createdAt;
    this._status = status;
    this._note = note;
  }

  // Getter
  get id() { return this._id; }
  get name() { return this._name; }
  get timeStart() { return this._timeStart; }
  get timeEnd() { return this._timeEnd; }
  get hours() { return this._hours; }
  get salaryPerHour() { return this._salaryPerHour; }
  get salaryTotal() { return this._salaryTotal; }
  get createdAt() { return this._createdAt; }
  get status() { return this._status; }
  get note() { return this._note; }

  // Setter
  set name(value) { this._name = value; }
  set timeStart(value) { this._timeStart = value; }
  set timeEnd(value) { this._timeEnd = value; }
  set hours(value) { this._hours = value; }
  set salaryPerHour(value) { this._salaryPerHour = value; }
  set salaryTotal(value) { this._salaryTotal = value; }
  set status(value) { this._status = value; }
  set note(value) { this._note = value; }
}
