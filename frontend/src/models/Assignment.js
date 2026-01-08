// src/models/Assignment.js
export default class Assignment {
  constructor(
    id,
    userId,
    shiftId,
    workDate,
    status,
    assignedById,
    assignedAt,
    note
  ) {
    this._id = id;
    this._userId = userId;
    this._shiftId = shiftId;
    this._workDate = workDate;
    this._status = status;
    this._assignedById = assignedById;
    this._assignedAt = assignedAt;
    this._note = note;
  }

  // ===== Getter =====
  get id() { return this._id; }
  get userId() { return this._userId; }
  get shiftId() { return this._shiftId; }
  get workDate() { return this._workDate; }
  get status() { return this._status; }
  get assignedById() { return this._assignedById; }
  get assignedAt() { return this._assignedAt; }
  get note() { return this._note; }

  // ===== Setter =====
  set userName(value) { this._userName = value; }
  set workDate(value) { this._workDate = value; }
  set status(value) { this._status = value; }
  set assignedAt(value) { this._assignedAt = value; }
  set note(value) { this._note = value; }
}
