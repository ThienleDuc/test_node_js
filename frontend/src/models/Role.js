// src/models/Role.js
export default class Role {
  constructor(id, name, description) {
    this._id = id;
    this._name = name;
    this._description = description;
  }

  // Getter
  get id() { return this._id; }
  get name() { return this._name; }
  get description() { return this._description; }

  // Setter
  set name(value) { this._name = value; }
  set description(value) { this._description = value; }
}
