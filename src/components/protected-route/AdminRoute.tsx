'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Spinner from '../button/Spinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

interface User {
  role?: string;
  [key: string]: any;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.registration.user) as User | null;
  const isAuthenticated = useSelector((state: RootState) => state.registration.isAuthenticated);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Phương pháp an toàn để kiểm tra quyền truy cập
    const checkAuth = () => {
      console.log("AdminRoute - Checking auth:", { isAuthenticated, userRole: user?.role });
      
      if (!isAuthenticated) {
        console.log("AdminRoute - Not authenticated");
        localStorage.setItem('redirectToLogin', 'true');
        setIsAuthorized(false);
        return;
      }
      
      if (user && user.role !== 'admin') {
        console.log("AdminRoute - Not admin");
        localStorage.setItem('redirectToHome', 'true');
        setIsAuthorized(false);
        return;
      }
      
      console.log("AdminRoute - Admin role confirmed");
      setIsAuthorized(true);
    };
    
    const timeoutId = setTimeout(checkAuth, 100);
    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, user]);
  
  // Xử lý chuyển hướng dựa trên quyền truy cập
  useEffect(() => {
    if (isAuthorized === false) {
      setLoading(false);
      
      if (localStorage.getItem('redirectToLogin') === 'true') {
        localStorage.removeItem('redirectToLogin');
        window.location.replace('/login');
      } else if (localStorage.getItem('redirectToHome') === 'true') {
        localStorage.removeItem('redirectToHome');
        window.location.replace('/');
      }
    } else if (isAuthorized === true) {
      setLoading(false);
    }
  }, [isAuthorized]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner />
      </div>
    );
  }
  
  // Chỉ render nội dung nếu được phép truy cập
  return isAuthorized ? <>{children}</> : null;
};

export default AdminRoute; 