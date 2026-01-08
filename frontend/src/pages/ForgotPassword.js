import React, { useState } from "react";

function ForgotPassword() {
  const [form, setForm] = useState({
    email: "",
    tenNguoiDung: "",
    maNguoiDung: "",
    vaiTro: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Thay bằng logic gửi yêu cầu reset mật khẩu lên server
    console.log("Yêu cầu quên mật khẩu:", form);

    setSubmitted(true);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow-sm" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Quên mật khẩu</h3>

          {submitted ? (
            <div className="alert alert-success">
              Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Tên người dùng</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.tenNguoiDung}
                  onChange={(e) => setForm({ ...form, tenNguoiDung: e.target.value })}
                  placeholder="Nhập tên của bạn"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Mã người dùng</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.maNguoiDung}
                  onChange={(e) => setForm({ ...form, maNguoiDung: e.target.value })}
                  placeholder="Nhập mã người dùng"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Vai trò</label>
                <select
                  className="form-select"
                  value={form.vaiTro}
                  onChange={(e) => setForm({ ...form, vaiTro: e.target.value })}
                  required
                >
                  <option value="">Chọn vai trò</option>
                  <option value="QuanLyCuaHang">Quản lý cửa hàng</option>
                  <option value="ThuNgan">Nhân viên Thu ngân</option>
                  <option value="Kho">Nhân viên Kho</option>
                </select>
              </div>

              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary">Gửi yêu cầu</button>
              </div>
            </form>
          )}
        </div>

        <div className="card-footer text-center">
          <a href="/login">Quay lại trang đăng nhập</a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
