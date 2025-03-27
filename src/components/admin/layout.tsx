"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHome, FaChartLine, FaUsers, FaUserShield, FaCog, FaBell, FaList, FaBox } from "react-icons/fa";
import CategoryDropdown from "./CategoryDropdown";
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
            <span className="brand-name">AdminLTE</span>
          </Link>

          <div className="nav-links">
            <Link href="/dashboard" className="nav-link">
              <FaHome />
              <span>Trang Chủ</span>
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
                <Image
                  src="/assets/admin/img/user2-160x160.jpg"
                  alt="Profile"
                  width={32}
                  height={32}
                  className="profile-img"
                />
              </button>
              {isProfileOpen && (
                <div className="dropdown-content">
                  <Link href="/profile" className="dropdown-item">
                    <i className="fas fa-user"></i>
                    <span>Hồ Sơ</span>
                  </Link>
                  <Link href="/settings" className="dropdown-item">
                    <FaCog />
                    <span>Cài Đặt</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <Link href="/logout" className="dropdown-item">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Đăng Xuất</span>
                  </Link>
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