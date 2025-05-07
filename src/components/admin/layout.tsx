"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHome, FaChartLine, FaUsers, FaUserShield, FaCog, FaBell, FaList, FaBox, FaSignOutAlt, FaSignInAlt, FaUser, FaChartBar, FaShoppingCart, FaBars } from "react-icons/fa";
import CategoryDropdown from "./CategoryDropdown";
import "./admin.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useRouter, usePathname } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logout } from "@/store/reducers/registrationSlice";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  
  // Lấy thông tin đăng nhập từ Redux store
  const isAuthenticated = useSelector((state: RootState) => state.registration.isAuthenticated);
  const user = useSelector((state: RootState) => state.registration.user);

  // Kiểm tra nếu cần đăng xuất (dựa trên localStorage)
  useEffect(() => {
    const shouldLogout = localStorage.getItem('triggerLogout');
    if (shouldLogout === 'true') {
      localStorage.removeItem('triggerLogout');
      
      // Đã đăng xuất trên server-side, chuyển hướng về trang login
      const loginPath = '/login';
      
      // Sử dụng window.location.replace thay vì router.push
      // replace() hữu ích hơn vì nó không thêm vào history
      window.location.replace(loginPath);
    }
  }, []);

  // Xử lý đăng xuất mà không gây lỗi hooks
  const handleLogout = () => {
    // Đóng dropdown menu profile trước
    setIsProfileOpen(false);
    
    try {
      // Xóa thông tin đăng nhập
      localStorage.removeItem('login_token');
      localStorage.removeItem('login_user');

      // Đặt trạng thái Redux
      dispatch(logout());
      
      // Đặt flag để useEffect biết cần chuyển hướng ở lần render tiếp theo
      localStorage.setItem('triggerLogout', 'true');
      
      // Hiển thị thông báo
      toast.success("Đăng xuất thành công", {
        autoClose: 1000,
        onClose: () => {
          // Làm mới trang để áp dụng thay đổi và chuyển đến trang login
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      toast.error("Có lỗi xảy ra khi đăng xuất");
    }
  };

  // Close dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isNotificationOpen || isProfileOpen || isMobileMenuOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.notification-dropdown') && 
            !target.closest('.profile-dropdown') &&
            !target.closest('.mobile-menu-toggle')) {
          setIsNotificationOpen(false);
          setIsProfileOpen(false);
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen, isProfileOpen, isMobileMenuOpen]);

  return (
    <div className="modern-wrapper">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <nav className="top-nav">
        <div className="nav-left">
          <Link href="/admin" className="nav-brand">
            <Image
              src="/assets/admin/img/AdminLTELogo.png"
              alt="Logo"
              width={35}
              height={35}
              className="brand-logo"
            />
            <span className="brand-name">Admin</span>
          </Link>

          <button 
            className="mobile-menu-toggle d-md-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars />
          </button>

          <div className={`nav-links ${isMobileMenuOpen ? 'show' : ''}`}>
            {/* <Link href="/admin" className={`nav-link ${pathname === '/admin' ? 'active' : ''}`}>
              <FaHome />
              <span>Trang Chủ</span>
            </Link> */}
            <Link href="/analytics" className={`nav-link ${pathname === '/analytics' ? 'active' : ''}`}>
              <FaChartBar />
              <span>Thống kê</span>
            </Link>
            <Link href="/admin" className={`nav-link ${pathname === '/admin' ? 'active' : ''}`}>
              <FaUserShield />
              <span>Quản Trị Viên</span>
            </Link>
            <Link href="/user" className={`nav-link ${pathname === '/user' ? 'active' : ''}`}>
              <FaUsers />
              <span>Người Dùng</span>
            </Link>
            <Link href="/orders-admin" className={`nav-link ${pathname === '/orders-admin' ? 'active' : ''}`}>
              <FaShoppingCart />
              <span>Đơn Hàng</span>
            </Link>
            <CategoryDropdown />
            <Link href="/product" className={`nav-link ${pathname === '/product' ? 'active' : ''}`}>
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
              <FaUserShield className="profile-icon"/>
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