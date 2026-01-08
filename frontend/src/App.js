// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import SidebarToggle from './components/SidebarToggle';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

import NguoiDung from './pages/NguoiDung';
import VaiTro from './pages/VaiTro';
import QuyenHan from './pages/QuyenHan';
import VaiTroQuyenHan from './pages/VaiTroQuyenHan';
import SanPham from './pages/SanPham';
import NhaCungCap from './pages/NhaCungCap';
import CongNo from './pages/CongNo';
import ThoiGianBieu from './pages/ThoiGianBieu';
import PhanCong from './pages/PhanCong';
import ThanhToanCa from './pages/ThanhToanCa';
import DoanhThu from './pages/DoanhThu';
import PhieuNhap from './pages/PhieuNhap';
import ChiTietPhieuNhap from './pages/ChiTietPhieuNhap';
import HoaDon from './pages/HoaDon';
import ChiTietHoaDon from './pages/ChiTietHoaDon';

import LoginAdmin from './pages/Login/LoginAdmin';
import LoginManager from './pages/Login/LoginManager';
import LoginCashier from './pages/Login/LoginCashier';
import LoginWarehouse from './pages/Login/LoginWarehouse';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <>
      <Header />
      <SidebarToggle />
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <Sidebar />
        </div>
        <div id="layoutSidenav_content">
          <main>
            <Routes>
              {/* Login routes */}
              <Route path="/login/quan-tri-vien" element={<LoginAdmin />} />
              <Route path="/login/quan-ly-cua-hang" element={<LoginManager />} />
              <Route path="/login/nhan-vien-thu-ngan" element={<LoginCashier />} />
              <Route path="/login/nhan-vien-kho" element={<LoginWarehouse />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Routes bảo vệ */}
              <Route path="/nguoi-dung" element={<NguoiDung />} />
              <Route path="/vai-tro" element={<VaiTro />} />
              <Route path="/quyen-han" element={<QuyenHan />} />
              <Route path="/vai-tro/:maVT" element={<VaiTroQuyenHan />} />

              <Route path="/nhan-vien" element={<NguoiDung />} />
              <Route path="/san-pham" element={<SanPham />} />
              <Route path="/nha-cung-cap" element={<NhaCungCap />} />
              <Route path="/cong-no" element={<CongNo />} />
              <Route path="/thoi-gian-bieu" element={<ThoiGianBieu />} />
              <Route path="/phan-cong" element={<PhanCong />} />
              <Route path="/thanh-toan-ca" element={<ThanhToanCa />} />
              <Route path="/doanh-thu" element={<DoanhThu />} />

              <Route path="/phieu-nhap" element={<PhieuNhap />} />
              <Route path="/phieu-nhap/:maPN" element={<ChiTietPhieuNhap />} />

              <Route path="/lap-hoa-don" element={<HoaDon />} />
              <Route path="/lap-hoa-don/:maHD" element={<ChiTietHoaDon />} />

              {/* Default route */}
              <Route path="*" element={<Navigate to="/login/quan-tri-vien" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
