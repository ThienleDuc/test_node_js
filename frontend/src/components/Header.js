import { useNavigate, Link } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";

const roleLoginPaths = {
  "Quản trị hệ thống": "/login/quan-tri-vien",
  "Quản lý cửa hàng": "/login/quan-ly-cua-hang",
  "Nhân viên kho": "/login/nhan-vien-kho",
  "Nhân viên thu ngân": "/login/nhan-vien-thu-ngan",
};

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useSession();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect về trang login theo role trước khi logout
      const target = user ? roleLoginPaths[user.TenVaiTro] || "/login" : "/login";
      navigate(target, { replace: true });
    } catch (err) {
      console.error("Logout thất bại", err);
    }
  };

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
      <Link className="navbar-brand ps-3" to="/">Supermarket</Link>
      <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" type="button">
        <i className="fas fa-bars"></i>
      </button>

      <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
        <div className="input-group">
          <input className="form-control" type="text" placeholder="Search for..." />
          <button className="btn btn-primary" type="button"><i className="fas fa-search"></i></button>
        </div>
      </form>

      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        {!user ? (
          <li className="nav-item">
            <span className="nav-link text-warning">
              <i className="fas fa-exclamation-circle me-1"></i> Chưa đăng nhập
            </span>
          </li>
        ) : (
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle btn btn-link"
              id="navbarDropdown"
              type="button"
              data-bs-toggle="dropdown"
            >
              <i className="fas fa-user fa-fw"></i> <span className="ms-2">{user.HoTen}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li>
                <Link className="dropdown-item" to="/settings">Settings</Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/activity-log">Activity Log</Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Header;
