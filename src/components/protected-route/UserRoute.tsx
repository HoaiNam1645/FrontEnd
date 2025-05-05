'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Spinner from '../button/Spinner';

interface UserRouteProps {
  children: React.ReactNode;
}

interface User {
  role?: string;
  [key: string]: any;
}

const UserRoute: React.FC<UserRouteProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.registration.user) as User | null;
  const isAuthenticated = useSelector((state: RootState) => state.registration.isAuthenticated);

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    // Nếu là admin, chuyển hướng đến trang admin
    if (user && user.role === 'admin') {
      router.push('/admin');
      return;
    }

    setLoading(false);
  }, [isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
};

export default UserRoute; 