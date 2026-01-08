import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { getUserPermissions as fetchUserPermissions } from '../api/auth.api';

function Sidebar() {
  const { user } = useSession();
  const location = useLocation();

  const [permissions, setPermissions] = useState([]);

  const isActive = (path) => location.pathname.startsWith(path) ? "active" : "";

  // Khi user thay đổi, fetch permissions
  useEffect(() => {
    const loadPermissions = async () => {
      if (user) {
        try {
          const res = await fetchUserPermissions();
          if (res.data.success) {
            setPermissions(res.data.permissions || []);
          } else {
            setPermissions([]);
          }
        } catch (err) {
          setPermissions([]);
        }
      } else {
        setPermissions([]);
      }
    };
    loadPermissions();
  }, [user]);

  const permissionMenuMap = {
    "Quản lý đăng nhập": [
      { path: "/nguoi-dung", label: "Người dùng", icon: "fas fa-users" },
      { path: "/vai-tro", label: "Vai trò", icon: "fas fa-id-badge" },
      { path: "/quyen-han", label: "Quyền hạn", icon: "fas fa-lock" },
    ],
    "Quản lý người dùng & phân quyền": [
      { path: "/nguoi-dung", label: "Người dùng", icon: "fas fa-users" },
    ],
    "Quản lý sản phẩm": [
      { path: "/san-pham", label: "Sản phẩm", icon: "fas fa-box" },
    ],
    "Quản lý kho hàng": [
      { path: "/phieu-nhap", label: "Phiếu nhập", icon: "fas fa-file-import" },
      { path: "/san-pham", label: "Sản phẩm", icon: "fas fa-box" },
    ],
    "Quản lý nhà cung cấp": [
      { path: "/nha-cung-cap", label: "Nhà cung cấp", icon: "fas fa-truck" },
    ],
    "Quản lý công nợ": [
      { path: "/cong-no", label: "Công nợ", icon: "fas fa-file-invoice-dollar" },
    ],
    "Tạo và phân công nhân viên": [
      { path: "/phan-cong", label: "Phân công", icon: "fas fa-tasks" },
    ],
    "Thanh toán & chấm công": [
      { path: "/thanh-toan-ca", label: "Lịch làm & Chấm công", icon: "fas fa-clock" },
    ],
    "Lập hóa đơn bán hàng": [
      { path: "/lap-hoa-don", label: "Lập hóa đơn", icon: "fas fa-receipt" },
    ],
    "Thống kê doanh thu": [
      { path: "/doanh-thu", label: "Doanh thu", icon: "fas fa-chart-line" },
    ]
  };

  const menuItems = [];
  const addedPaths = new Set();
  (permissions || []).forEach(p => {
    const items = permissionMenuMap[p];
    if (items) {
      items.forEach(item => {
        if (!addedPaths.has(item.path)) {
          menuItems.push(item);
          addedPaths.add(item.path);
        }
      });
    }
  });

  const loginMenu = [
    { path: "/login/quan-tri-vien", label: "Quản trị viên", icon: "fas fa-user-shield" },
    { path: "/login/quan-ly-cua-hang", label: "Quản lý cửa hàng", icon: "fas fa-store" },
    { path: "/login/nhan-vien-kho", label: "Nhân viên kho", icon: "fas fa-warehouse" },
    { path: "/login/nhan-vien-thu-ngan", label: "Nhân viên thu ngân", icon: "fas fa-cash-register" },
  ];

  const itemsToShow = user ? menuItems : loginMenu;

  return (
    <div id="layoutSidenav_nav">
      <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
        <div className="sb-sidenav-menu">
          <div className="nav">
            {itemsToShow.map(item => (
              <NavLink key={item.path} className={`nav-link ${isActive(item.path)}`} to={item.path}>
                <div className="sb-nav-link-icon"><i className={item.icon}></i></div>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="sb-sidenav-footer">
          <div className="small">Logged in as:</div>
          {user ? user.TenVaiTro : "Guest"}
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
