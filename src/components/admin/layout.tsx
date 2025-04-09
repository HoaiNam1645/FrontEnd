"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHome, FaChartLine, FaUsers, FaUserShield, FaCog, FaBell, FaList, FaBox, FaSignOutAlt, FaSignInAlt, FaUser } from "react-icons/fa";
import CategoryDropdown from "./CategoryDropdown";
import "./admin.css";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  
  // Lấy thông tin đăng nhập từ Redux store
  const isAuthenticated = useSelector((state: RootState) => state.registration.isAuthenticated);
  const user = useSelector((state: RootState) => state.registration.user);

  const handleLogout = () => {
    // Xóa token và thông tin người dùng từ localStorage
    localStorage.removeItem('login_token');
    localStorage.removeItem('login_user');
    
    // Chuyển hướng về trang đăng nhập
    window.location.href = '/login';
  };

  return (
    <div className="modern-wrapper">
      <nav className="top-nav">
        <div className="nav-left">
          <Link href="/" className="nav-brand">
            <Image
              src="/assets/admin/img/AdminLTELogo.png"
              alt="Logo"
              width={35}
              height={35}
              className="brand-logo"
            />
            <span className="brand-name">Admin</span>
          </Link>

          <div className="nav-links">
            <Link href="/dashboard" className="nav-link">
              <FaHome />
              <span>Tin Tức</span>
            </Link>
            <Link href="/analytics" className="nav-link">
              <FaChartLine />
              <span>Thống Kê</span>
            </Link>
            <Link href="/admin" className="nav-link">
              <FaUserShield />
              <span>Quản Trị Viên</span>
            </Link>
            <Link href="/user" className="nav-link">
              <FaUsers />
              <span>Người Dùng</span>
            </Link>
            <Link href="/user" className="nav-link">
              <FaUsers />
              <span>Đơn Hàng</span>
            </Link>
            <CategoryDropdown />
            <Link href="/product" className="nav-link">
              <FaBox />
              <span>Sản Phẩm</span>
            </Link>
          </div>
        </div>

        <div className="nav-right">
          <div className="nav-actions">
            <div className="notification-dropdown">
              <button 
                className="icon-btn"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <FaBell />
                <span className="badge">3</span>
              </button>
              {isNotificationOpen && (
                <div className="dropdown-content">
                  <div className="notification-item">
                    <i className="fas fa-user-plus"></i>
                    <div className="notification-text">
                      <p>Người dùng mới đăng ký</p>
                      <span>2 phút trước</span>
                    </div>
                  </div>
                  <div className="notification-item">
                    <i className="fas fa-file-alt"></i>
                    <div className="notification-text">
                      <p>Báo cáo mới</p>
                      <span>1 giờ trước</span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link href="/notifications" className="dropdown-item">
                    Xem tất cả thông báo
                  </Link>
                </div>
              )}
            </div>

            <div className="profile-dropdown">
              <button 
                className="profile-btn"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                {isAuthenticated && user ? (
                  <Image
                    src="/assets/admin/img/user2-160x160.jpg"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="profile-img"
                  />
                ) : (
                  <FaUser className="profile-icon" />
                )}
              </button>
              {isProfileOpen && (
                <div className="dropdown-content">
                  {isAuthenticated && user ? (
                    // Đã đăng nhập
                    <>
                      <Link href="/admin/profile" className="dropdown-item">
                        <FaUser />
                        <span>Hồ Sơ</span>
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item">
                        <FaSignOutAlt />
                        <span>Đăng Xuất</span>
                      </button>
                    </>
                  ) : (
                    // Chưa đăng nhập
                    <Link href="/login" className="dropdown-item">
                      <FaSignInAlt />
                      <span>Đăng Nhập</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="content-wrapper">
        {children}
      </main>
    </div>
  );
}