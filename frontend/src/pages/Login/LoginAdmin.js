import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput";
import { useSession } from "../../contexts/SessionContext";
import Swal from "sweetalert2";
import { register as registerApi } from "../../api/auth.api";

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  const navigate = useNavigate();
  const { login } = useSession();

  // Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({ Email: email, MatKhau: password });
      if (!res.data.success) {
        setError(res.data.message || "Đăng nhập thất bại");
        return;
      }

      const user = res.data.user;
      if (user?.TenVaiTro !== "Quản trị hệ thống") {
        setError("Bạn không có quyền truy cập trang Quản trị hệ thống!");
        return;
      }

      navigate("/nguoi-dung", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegLoading(true);

    try {
      const res = await registerApi({
        Email: regEmail,
        MatKhau: regPassword,
        TenVaiTro: "Quản trị hệ thống"
      });

      if (!res.data.success) {
        setRegError(res.data.message || "Đăng ký thất bại");
        return;
      }

      const newUserId = res.data.user.id; // 🔹 Lấy id user vừa tạo

      Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công',
        text: `Bạn có thể đăng nhập ngay! ID: ${newUserId}`,
        timer: 2000,
        showConfirmButton: false
      });

      setRegEmail("");
      setRegPassword("");
      const modalEl = document.getElementById('registerModal');
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      modal.hide();

    } catch (err) {
      setRegError(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="container d-flex gap-2 align-items-center justify-content-center vh-100">
      {/* Login Card */}
      <div className="card shadow-sm p-4 mb-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4"><i className="fas fa-users-cog"></i> Đăng nhập Quản trị viên</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-group-text"><i className="fas fa-user"></i></span>
            <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group mb-3">
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu" />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="text-center mt-3">
          {/* Nút mở modal đăng ký */}
          Chưa có tài khoản?
          <button type="button" className="btn btn-link" data-bs-toggle="modal" data-bs-target="#registerModal">
            Đăng ký
          </button>
        </div>
      </div>

      {/* Modal Đăng ký */}
      <div className="modal fade" id="registerModal" tabIndex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="registerModalLabel">Đăng ký Quản trị viên</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {regError && <div className="alert alert-danger">{regError}</div>}
              <form onSubmit={handleRegister}>
                <div className="input-group mb-3">
                  <span className="input-group-text"><i className="fas fa-user"></i></span>
                  <input type="email" className="form-control" placeholder="Email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                </div>
                <div className="input-group mb-3">
                  <PasswordInput value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Nhập mật khẩu" />
                </div>
                <button type="submit" className="btn btn-success w-100" disabled={regLoading}>
                  {regLoading ? "Đang đăng ký..." : "Đăng ký"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginAdmin;
