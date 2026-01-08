export default class User {
  constructor(id, name, email, password, status, createdAt, role, avatar) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._password = password;
    this._status = status;
    this._createdAt = createdAt;
    this._role = role;
    this._avatar = avatar; // avatar
  }

  // --- Getter ---
  get id() { return this._id; }
  get name() { return this._name; }
  get email() { return this._email; }
  get password() { return this._password; }
  get status() { return this._status; }
  get createdAt() { return this._createdAt; }
  get role() { return this._role; }
  get avatar() { return this._avatar; }

  // --- Setter ---
  set id(value) { this._id = value; }
  set name(value) { this._name = value; }
  set email(value) { this._email = value; }
  set password(value) { this._password = value; }
  set status(value) { this._status = value; }
  set createdAt(value) { this._createdAt = value; }
  set role(value) { this._role = value; }
  set avatar(value) { this._avatar = value; }
}
