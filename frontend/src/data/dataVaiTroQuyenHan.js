import { dataVaiTro } from "./dataVaiTro";
import { dataQuyenHan } from "./dataQuyenHan";

const rawMapping = [
  ["1", "1"],
  ["1", "2"],
  ["2", "3"],
  ["2", "4"],
  ["3", "5"],
  ["4", "6"],
  ["4", "7"],
  ["1", "8"],
  ["2", "9"],
  ["3", "10"],
];

// Map sang object
export const dataVaiTroQuyenHan = rawMapping.map(([roleId, permId]) => {
  const roleInstance = dataVaiTro.find(r => r.id === roleId);
  const permInstance = dataQuyenHan.find(p => p.id === permId);

  const roleObj = roleInstance
    ? {
        id: roleInstance.id,
        name: roleInstance.name,
        description: roleInstance.description
      }
    : null;

  const permObj = permInstance
    ? {
        id: permInstance.id,
        name: permInstance.name,
        description: permInstance.description
      }
    : null;

  return {
    role: roleObj,
    permission: permObj
  };
});

// --- Helper ---
export const getPermissionsByRoleId = (roleId) =>
  dataVaiTroQuyenHan
    .filter(rp => rp.role?.id === roleId)
    .map(rp => rp.permission);

export const getRolesByPermissionId = (permId) =>
  dataVaiTroQuyenHan
    .filter(rp => rp.permission?.id === permId)
    .map(rp => rp.role);
