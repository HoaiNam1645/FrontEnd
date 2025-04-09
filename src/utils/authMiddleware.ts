import { NextRequest, NextResponse } from 'next/server';

interface UserData {
  role?: string;
  [key: string]: any;
}

export function checkUserRole(): string | null {
  if (typeof window !== 'undefined') {
    const loginUserData = localStorage.getItem('login_user');
    if (loginUserData) {
      try {
        const userData: UserData = JSON.parse(loginUserData);
        return userData.role || null;
      } catch (error) {
        console.error('Lỗi khi phân tích dữ liệu người dùng:', error);
        return null;
      }
    }
  }
  return null;
}

export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('login_token');
    const userData = localStorage.getItem('login_user');
    return !!token && !!userData;
  }
  return false;
}

export function redirectBasedOnRole() {
  if (typeof window !== 'undefined') {
    const role = checkUserRole();
    const isAuth = isAuthenticated();
    
    // Path hiện tại
    const currentPath = window.location.pathname;
    
    // Người dùng chưa đăng nhập truy cập trang admin hoặc trang yêu cầu đăng nhập
    if (!isAuth && (currentPath.startsWith('/admin') || currentPath === '/user-profile')) {
      window.location.href = '/login';
      return;
    }
    
    // Người dùng đã đăng nhập nhưng không phải admin truy cập trang admin
    if (isAuth && role !== 'admin' && currentPath.startsWith('/admin')) {
      window.location.href = '/';
      return;
    }
    
    // Admin truy cập trang người dùng thông thường
    if (isAuth && role === 'admin' && currentPath === '/user-profile') {
      window.location.href = '/admin';
      return;
    }
  }
}

export async function protectAdminRoute() {
  if (typeof window !== 'undefined') {
    const role = checkUserRole();
    const isAuth = isAuthenticated();
    
    if (!isAuth) {
      window.location.href = '/login';
      return;
    }
    
    if (role !== 'admin') {
      window.location.href = '/';
      return;
    }
  }
} 