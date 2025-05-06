"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const OrderSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    // Tự động chuyển hướng về trang chủ sau 5 giây
    const timer = setTimeout(() => {
      router.push('/track-order');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="container py-5 text-center">
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ fontSize: '80px', color: '#4CAF50', marginBottom: '20px' }}>
          <i className="gicon gi-check-circle"></i>
        </div>
        <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Tạo đơn hàng hàng thành công!</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
          Cảm ơn bạn đã tạo đơn hàng. Chúng tôi đã nhận được đơn đặt hàng của bạn.
          Bạn có thể kiểm tra trạng thái đơn hàng, thah toán và huỷ đơn hàng trong mục "Đơn hàng của tôi".
        </p>
        <div style={{ marginTop: '30px' }}>
          <Link 
            href="/track-order" 
            style={{ 
              display: 'inline-block', 
              padding: '12px 24px', 
              background: '#333', 
              color: '#fff', 
              borderRadius: '5px', 
              textDecoration: 'none',
              marginRight: '10px'
            }}
          >
            Xem đơn hàng
          </Link>
          <Link 
            href="/" 
            style={{ 
              display: 'inline-block', 
              padding: '12px 24px', 
              background: '#4CAF50', 
              color: '#fff', 
              borderRadius: '5px', 
              textDecoration: 'none' 
            }}
          >
            Tiếp tục mua sắm
          </Link>
        </div>
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#777' }}>
          Bạn sẽ được chuyển hướng tới trang đơn hàng sau 3 giây...
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess; 