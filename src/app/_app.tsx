"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/store/reducers/registrationSlice';
import { showSuccessToast } from '@/components/toast-popup/Toastify';

export default function AuthHandler({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Kiểm tra tham số URL khi trang web được tải
    const handleAuthParams = () => {
      try {
        // Lấy tham số từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userDataStr = urlParams.get('userData');

        if (token && userDataStr) {
          // Xóa tham số URL để tránh xử lý lại khi làm mới trang
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Giải mã userData từ URL
          const user = JSON.parse(decodeURIComponent(userDataStr));
          
          // Lưu token & user vào localStorage
          localStorage.setItem("login_token", token);
          localStorage.setItem("login_user", JSON.stringify(user));
          
          // Dispatch action đăng nhập
          dispatch(login(user));
          
          showSuccessToast("Đăng nhập thành công");
        }
      } catch (error) {
        console.error("Error processing auth parameters:", error);
      }
    };

    handleAuthParams();
  }, [dispatch]);

  return <>{children}</>;
} 