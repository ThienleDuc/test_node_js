// src/models/RolePermission.js
export default class RolePermission {
  constructor(roleId, roleName, permissionId, permissionName) {
    this._roleId = roleId;
    this._roleName = roleName;
    this._permissionId = permissionId;
    this._permissionName = permissionName;
  }

  // Getter
  get roleId() { return this._roleId; }
  get roleName() { return this._roleName; }
  get permissionId() { return this._permissionId; }
  get permissionName() { return this._permissionName; }

  // Setter
  set roleName(value) { this._roleName = value; }
  set permissionName(value) { this._permissionName = value; }
}
