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

  useEffect(() => {
    console.log("AdminRoute - User:", user);
    console.log("AdminRoute - isAuthenticated:", isAuthenticated);
    console.log("AdminRoute - User role:", user?.role);

    // Check authentication and admin role
    if (!isAuthenticated) {
      console.log("AdminRoute - Not authenticated, redirecting to login");
      // router.push('/login');
      window.location.href = '/login';
      return;
    }

    if (user && user.role !== 'admin') {
      console.log("AdminRoute - Not admin, redirecting to home");
      // router.push('/');
      window.location.href = '/';
      return;
    }

    console.log("AdminRoute - Admin role confirmed, loading admin page");
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

export default AdminRoute; 