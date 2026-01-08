// src/pages/LoginManager.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput";
import { useSession } from "../../contexts/SessionContext";

function LoginManager() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useSession(); // dùng context để lưu user

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔐 Gọi login từ context
      const res = await login({ Email: email, MatKhau: password });

      if (!res?.data?.success) {
        setError(res?.data?.message || "Đăng nhập thất bại");
        return;
      }

      const user = res.data.user;

      // Kiểm tra role Quản lý cửa hàng
      if (user?.TenVaiTro !== "Quản lý cửa hàng") {
        setError("Bạn không có quyền truy cập trang Quản lý cửa hàng!");
        return;
      }

      // ✅ Điều hướng sang trang chính của Quản lý cửa hàng
      navigate("/nguoi-dung", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">
          <i className="fas fa-store"></i> Đăng nhập Quản lý cửa hàng
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group mb-3">
            <span className="input-group-text"><i className="fas fa-user"></i></span>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group mb-3">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 mb-2"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="text-center mt-2">
            <a href="/forgot-password" className="small text-decoration-none text-secondary">
              Quên mật khẩu?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginManager;
