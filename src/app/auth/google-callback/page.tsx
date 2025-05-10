"use client";
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { login } from '@/store/reducers/registrationSlice';
import { showErrorToast, showSuccessToast } from '@/components/toast-popup/Toastify';

const GoogleCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      // Lấy token và userData từ URL
      const token = searchParams.get('token');
      const userDataStr = searchParams.get('userData');
      const error = searchParams.get('error');
      
      if (error) {
        console.error("Google login error:", error);
        showErrorToast(`Đăng nhập Google thất bại: ${error}`);
        router.push('/login');
        return;
      }

      if (!token || !userDataStr) {
        showErrorToast("Không nhận được thông tin xác thực từ Google");
        router.push('/login');
        return;
      }

      try {
        // Giải mã userData từ URL
        const user = JSON.parse(decodeURIComponent(userDataStr));

        // Lưu token & user vào localStorage
        localStorage.setItem("login_token", token);
        localStorage.setItem("login_user", JSON.stringify(user));

        // Dispatch action đăng nhập
        dispatch(login(user));

        showSuccessToast("Đăng nhập Google thành công");
        
        // Navigate after login completes
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error("Error processing Google login data:", error);
        showErrorToast("Xử lý dữ liệu đăng nhập Google thất bại");
        router.push('/login');
      }
    };

    handleGoogleCallback();
  }, [dispatch, router, searchParams]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang xử lý...</span>
        </div>
        <h3 className="mt-3">Đang xác thực đăng nhập Google...</h3>
      </div>
    </div>
  );
};

export default GoogleCallbackPage; 