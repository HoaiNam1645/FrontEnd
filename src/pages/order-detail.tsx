"use client";
import React, { useEffect, useState } from 'react';
import { cartService, OrderDetail, OrderItem, OrderWithItems } from "@/services/cartService";
import { useRouter } from 'next/navigation';
import Spinner from '@/components/button/Spinner';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Link from 'next/link';

interface OrderDetailPageProps {
  orderId: string;
}

const OrderDetailPage = ({ orderId }: OrderDetailPageProps) => {
  const router = useRouter();
  const login = useSelector(
    (state: RootState) => state.registration.isAuthenticated
  );
  const [orderData, setOrderData] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    // Check for status parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const statusParam = urlParams.get('status');
    
    if (statusParam === 'success') {
      setPaymentSuccess(true);
    }
  }, []);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!login || !orderId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await cartService.getOrderDetail(orderId);
        setOrderData(data);
      } catch (err) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetail();
  }, [login, orderId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "canceled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#1976d2"; // màu xanh dương
      case "processing":
        return "#f59e0b"; // màu cam/vàng
      case "shipped":
        return "#0288d1"; // màu xanh nhạt
      case "delivered":
        return "#2e7d32"; // màu xanh lá
      case "canceled":
        return "#c62828"; // màu đỏ
      default:
        return "#616161"; // màu xám
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "fi fi-rs-time-forward";
      case "processing":
        return "fi fi-rs-settings";
      case "shipped":
        return "fi fi-rs-truck-side";
      case "delivered":
        return "fi fi-rs-check";
      case "canceled":
        return "fi fi-rs-cross-circle";
      default:
        return "fi fi-rs-info";
    }
  };

  const getHeaderGradient = (status: string) => {
    switch (status) {
      case "pending":
        return "linear-gradient(to right, #1565c0, #42a5f5)"; // gradient xanh dương
      case "processing":
        return "linear-gradient(to right, #e65100, #ffa726)"; // gradient cam
      case "shipped":
        return "linear-gradient(to right, #00838f, #4dd0e1)"; // gradient xanh lam
      case "delivered":
        return "linear-gradient(to right, #2e7d32, #81c784)"; // gradient xanh lá
      case "canceled":
        return "linear-gradient(to right, #b71c1c, #e57373)"; // gradient đỏ
      default:
        return "linear-gradient(to right, #616161, #9e9e9e)"; // gradient xám
    }
  };

  const getThemeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#1976d2"; // xanh dương
      case "processing":
        return "#f59e0b"; // cam
      case "shipped":
        return "#0288d1"; // xanh lam
      case "delivered":
        return "#2e7d32"; // xanh lá
      case "canceled":
        return "#c62828"; // đỏ
      default:
        return "#616161"; // xám
    }
  };

  const handlePayment = async (orderId: string, amount: number) => {
    try {
      setPaymentLoading(true);
      setPaymentError(null);
      
      // Cập nhật URL API đúng
      // Nếu cần, thay đổi địa chỉ API này theo config của bạn
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';
      const response = await fetch(`${API_URL}/payment/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Accept': 'application/json'
        },
        body: JSON.stringify({
          amount: amount,
          orderId: orderId
        }),
      });
      
      // Kiểm tra nếu response không thành công
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      // Kiểm tra content-type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Invalid response format. Expected JSON, got:', text.substring(0, 100) + '...');
        throw new Error('Response không đúng định dạng JSON');
      }
      
      const data = await response.json();
      
      if (data.success && data.vnpUrl) {
        // Chuyển hướng người dùng đến trang thanh toán VNPay
        window.location.href = data.vnpUrl;
      } else {
        setPaymentError(data.message || 'Không thể tạo đơn thanh toán');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API thanh toán:', error);
      setPaymentError(error instanceof Error 
        ? `Lỗi: ${error.message}` 
        : 'Đã xảy ra lỗi khi kết nối đến cổng thanh toán');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancelLoading(true);
      setCancelError(null);
      
      console.log('Đang hủy đơn hàng ID:', orderId);
      await cartService.cancelOrder(orderId);
      
      setCancelSuccess(true);
      setShowCancelModal(false);
      
      // Thông báo thành công và chuyển hướng sau 1.5 giây
      setTimeout(() => {
        // Chuyển hướng về trang track-order
        router.push('/track-order');
      }, 1500);
      
    } catch (err) {
      console.error('Lỗi khi hủy đơn hàng:', err);
      setCancelError(err instanceof Error ? err.message : 'Lỗi không xác định khi hủy đơn hàng');
      setShowCancelModal(false);
    } finally {
      setCancelLoading(false);
    }
  };

  if (!login) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Vui lòng <a href="/login">đăng nhập</a> để xem chi tiết đơn hàng.
        </div>
      </div>
    );
  }

  const order = orderData?.order;
  const orderItems = orderData?.orderItemList || [];

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {paymentSuccess && (
            <div className="alert-custom alert-success-custom">
              <div className="alert-icon">
                <i className="gicon gi-check-circle"></i>
              </div>
              <div className="alert-content">
                <h4>Thanh toán thành công!</h4>
                <p>Đơn hàng của bạn đã được thanh toán. Cảm ơn bạn đã mua sắm.</p>
              </div>
            </div>
          )}
          
          {cancelSuccess && (
            <div className="alert-custom alert-success-custom">
              <div className="alert-icon">
                <i className="gicon gi-check-circle"></i>
              </div>
              <div className="alert-content">
                <h4>Hủy đơn hàng thành công!</h4>
                <p>Đơn hàng của bạn đã được hủy thành công.</p>
              </div>
            </div>
          )}
          
          {cancelError && (
            <div className="alert-custom alert-danger-custom">
              <div className="alert-icon">
                <i className="gicon gi-exclamation-triangle"></i>
              </div>
              <div className="alert-content">
                <h4>Không thể hủy đơn hàng</h4>
                <p>{cancelError}</p>
              </div>
            </div>
          )}

          {/* Cancel Confirmation Modal */}
          {showCancelModal && order && (
            <div className="cancel-modal-overlay">
              <div className="cancel-modal">
                <div className="cancel-modal-header">
                  <i className="gicon gi-exclamation-circle"></i>
                  <h3>Xác nhận hủy đơn hàng</h3>
                </div>
                <div className="cancel-modal-body">
                  <p>Bạn có chắc chắn muốn hủy đơn hàng <strong>#{order._id.substring(order._id.length - 8)}</strong>?</p>
                  <p>Hành động này không thể hoàn tác sau khi đã xác nhận.</p>
                </div>
                <div className="cancel-modal-footer">
                  <button 
                    className="cancel-modal-close-btn" 
                    onClick={() => setShowCancelModal(false)}
                    disabled={cancelLoading}
                  >
                    Giữ đơn hàng
                  </button>
                  <button 
                    className="cancel-modal-confirm-btn" 
                    onClick={() => handleCancelOrder(order._id)}
                    disabled={cancelLoading}
                  >
                    {cancelLoading ? (
                      <>
                        <span className="loading-spinner"></span> Đang hủy...
                      </>
                    ) : (
                      <>Xác nhận hủy</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner />
              <p className="mt-3">Đang tải thông tin đơn hàng...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">
              {error}
              <div className="mt-3">
                <button className="back-btn" onClick={() => router.back()}>
                  <i className="gicon gi-arrow-left"></i> Quay lại
                </button>
              </div>
            </div>
          ) : order ? (
            <div className="order-detail-card">
              <div className="order-detail-header" style={{ background: getHeaderGradient(order.status) }}>
                <div className="order-title">
                  <h3>Chi tiết đơn hàng <span className="order-number">#{order._id.substring(order._id.length - 8)}</span></h3>
                  <div className="order-date">
                    <i className="gicon gi-calendar"></i> {formatDate(order.createdAt)}
                  </div>
                </div>
                <div className="order-status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                  <i className={getStatusIcon(order.status)} style={{ marginRight: '8px' }}></i>
                  <span>{getStatusText(order.status)}</span>
                </div>
              </div>
              
              <div className="order-detail-body" style={{ '--theme-color': getThemeColor(order.status) } as React.CSSProperties}>
                <div className="order-info-section">
                  <div className="section-title">
                    <i className="gicon gi-info-circle"></i> Thông tin đơn hàng
                  </div>
                  <div className="order-info-grid">
                    <div className="info-item">
                      <span className="info-label">Mã đơn hàng</span>
                      <span className="info-value">#{order._id.substring(order._id.length - 8)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Ngày đặt hàng</span>
                      <span className="info-value">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phương thức thanh toán</span>
                      <span className="info-value payment-method">
                        <i className="gicon gi-credit-card"></i>
                        {order.paymentMethod === 'credit_card' ? 'Thẻ tín dụng' : order.paymentMethod}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Tổng tiền</span>
                      <span className="info-value total-amount">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="order-info-section">
                  <div className="section-title">
                    <i className="gicon gi-house"></i> Thông tin giao hàng
                  </div>
                  <div className="shipping-info">
                    <div className="recipient-info">
                      <div className="recipient-avatar">
                        <i className="gicon gi-user"></i>
                      </div>
                      <div className="recipient-details">
                        <h5>{order.recipientName || 'Không có tên'}</h5>
                        <p><i className="gicon gi-phone"></i> {order.phoneNumber || 'Không có số điện thoại'}</p>
                        <p><i className="gicon gi-location-dot"></i> {order.address || 'Không có địa chỉ'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="order-info-section">
                  <div className="section-title">
                    <i className="gicon gi-bag-shopping"></i> Sản phẩm đã đặt
                  </div>
                  {orderItems.length > 0 ? (
                    <div className="order-items">
                      {orderItems.map((item) => (
                        <div key={item._id} className="order-item">
                          <div className="product-image">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.name} />
                            ) : (
                              <div className="no-image">
                                <i className="gicon gi-image"></i>
                              </div>
                            )}
                          </div>
                          <div className="product-info">
                            <h4>{item.name}</h4>
                            <div className="product-details">
                              <span className="product-price">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                              </span>
                              <span className="product-quantity">
                                x{item.quantity}
                              </span>
                            </div>
                            <div className="product-total">
                              <span className="product-total-label">Thành tiền:</span>
                              <span className="product-total-price">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                          <div className="product-action">
                            <Link href={`/product-left-sidebar/${item.productId}`} className="view-product-btn">
                              <i className="gicon gi-eye"></i> Xem sản phẩm
                            </Link>
                          </div>
                        </div>
                      ))}
                      
                      <div className="order-summary">
                        <div className="summary-line">
                          <span>Tổng tiền sản phẩm:</span>
                          <span>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                              orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
                            )}
                          </span>
                        </div>
                        <div className="summary-line">
                          <span>Phí vận chuyển:</span>
                          <span>Miễn phí</span>
                        </div>
                        <div className="summary-line total">
                          <span>Tổng thanh toán:</span>
                          <span>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="alert alert-info items-not-available">
                      <i className="gicon gi-info-circle"></i>
                      <p>Không có thông tin sản phẩm trong đơn hàng này.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="order-detail-footer">
                <button className="back-btn" onClick={() => router.back()}>
                  <i className="gicon gi-arrow-left"></i> Quay lại
                </button>
                <div className="action-buttons">
                  {order.status === 'pending' && (
                    <>
                      <button 
                        className="payment-btn" 
                        style={{ backgroundColor: '#2196f3' }}
                        onClick={() => handlePayment(order._id, order.totalAmount)}
                        disabled={paymentLoading}
                      >
                        {paymentLoading ? (
                          <>
                            <span className="loading-spinner"></span> Đang xử lý...
                          </>
                        ) : (
                          <>
                            <i className="gicon gi-credit-card"></i> Thanh toán
                          </>
                        )}
                      </button>
                      <button 
                        className="cancel-btn" 
                        style={{ backgroundColor: getThemeColor('canceled') }}
                        onClick={() => setShowCancelModal(true)}
                        disabled={cancelLoading}
                      >
                        {cancelLoading ? (
                          <>
                            <span className="loading-spinner"></span> Đang Xoá...
                          </>
                        ) : (
                          <>
                            <i className="gicon gi-times"></i> Xoá đơn hàng
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {paymentError && (
                <div className="alert-custom alert-danger-custom">
                  <div className="alert-icon">
                    <i className="gicon gi-exclamation-triangle"></i>
                  </div>
                  <div className="alert-content">
                    <h4>Lỗi thanh toán</h4>
                    <p>{paymentError}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="not-found-alert">
              <div className="not-found-icon">
                <i className="gicon gi-search"></i>
              </div>
              <h4>Không tìm thấy thông tin đơn hàng</h4>
              <p>Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
              <button className="back-btn mt-3" onClick={() => router.back()}>
                <i className="gicon gi-arrow-left"></i> Quay lại
              </button>
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .order-detail-card {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          margin-bottom: 30px;
        }
        
        .order-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 25px;
          color: white;
        }
        
        .order-title {
          display: flex;
          flex-direction: column;
        }
        
        .order-title h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }
        
        .order-number {
          background: rgba(255, 255, 255, 0.2);
          padding: 3px 8px;
          border-radius: 5px;
          margin-left: 8px;
          font-size: 16px;
        }
        
        .order-date {
          margin-top: 5px;
          font-size: 14px;
          opacity: 0.9;
        }
        
        .order-date i {
          margin-right: 5px;
        }
        
        .order-status-badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          color: white;
          display: inline-flex;
          align-items: center;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .order-status-badge::before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.7);
          margin-right: 8px;
        }
        
        .order-detail-body {
          padding: 25px;
        }
        
        .order-info-section {
          margin-bottom: 30px;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 25px;
          background-color: #fafafa;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        
        .order-info-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #333;
          display: flex;
          align-items: center;
        }
        
        .section-title i {
          margin-right: 10px;
          color: var(--theme-color);
          font-size: 18px;
        }
        
        .order-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
        }
        
        .info-label {
          font-size: 13px;
          color: #777;
          margin-bottom: 5px;
        }
        
        .info-value {
          font-size: 15px;
          font-weight: 500;
          color: #333;
        }
        
        .payment-method, .total-amount {
          display: flex;
          align-items: center;
        }
        
        .payment-method i, .total-amount i {
          margin-right: 5px;
          color: var(--theme-color);
        }
        
        .total-amount {
          font-weight: 700;
          color: var(--theme-color);
        }
        
        .shipping-info {
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        
        .recipient-info {
          display: flex;
          align-items: center;
        }
        
        .recipient-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: var(--theme-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 20px;
        }
        
        .recipient-details h5 {
          margin: 0 0 5px 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .recipient-details p {
          margin: 0 0 5px 0;
          font-size: 14px;
          display: flex;
          align-items: center;
        }
        
        .recipient-details p i {
          margin-right: 8px;
          color: #777;
          width: 15px;
        }
        
        .items-not-available {
          background-color: #e3f2fd;
          border-color: #bbdefb;
          color: #1976d2;
          padding: 15px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .items-not-available i {
          font-size: 24px;
          margin-bottom: 10px;
        }
        
        .items-not-available p {
          margin: 0 0 5px 0;
        }
        
        .order-detail-footer {
          display: flex;
          justify-content: space-between;
          padding: 20px 25px;
          background-color: #f5f5f5;
          border-top: 1px solid #eee;
        }
        
        .action-buttons {
          display: flex;
          gap: 10px;
        }
        
        .back-btn, .cancel-btn, .payment-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }
        
        .back-btn {
          background-color: #f0f0f0;
          color: #333;
        }
        
        .back-btn:hover {
          background-color: #e0e0e0;
        }
        
        .payment-btn {
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .payment-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .cancel-btn {
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .cancel-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .back-btn i, .cancel-btn i, .payment-btn i {
          margin-right: 8px;
        }
        
        .not-found-alert {
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
          padding: 40px 20px;
          text-align: center;
        }
        
        .not-found-icon {
          font-size: 50px;
          color: #ccc;
          margin-bottom: 20px;
        }
        
        .not-found-alert h4 {
          margin-bottom: 10px;
          font-size: 20px;
          font-weight: 600;
        }
        
        .not-found-alert p {
          color: #777;
          margin-bottom: 20px;
        }
        
        /* Styles for order items */
        .order-items {
          margin-top: 20px;
        }
        
        .order-item {
          display: flex;
          padding: 15px;
          margin-bottom: 15px;
          border: 1px solid #eee;
          border-radius: 8px;
          background-color: #fff;
          transition: all 0.3s ease;
        }
        
        .order-item:hover {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          border-color: var(--theme-color, #ddd);
        }
        
        .order-item:last-child {
          margin-bottom: 20px;
        }
        
        .product-image {
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          margin-right: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f9f9f9;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .product-image img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        
        .no-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #bbb;
          font-size: 24px;
        }
        
        .product-info {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        
        .product-info h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        
        .product-details {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .product-price {
          font-size: 14px;
          color: #777;
        }
        
        .product-quantity {
          font-size: 14px;
          color: #777;
          margin-left: 15px;
          padding: 2px 8px;
          background-color: #f0f0f0;
          border-radius: 12px;
        }
        
        .product-total {
          margin-top: auto;
          display: flex;
          align-items: center;
        }
        
        .product-total-label {
          font-size: 13px;
          color: #777;
          margin-right: 5px;
        }
        
        .product-total-price {
          font-size: 15px;
          font-weight: 600;
          color: var(--theme-color);
        }
        
        .product-action {
          display: flex;
          align-items: flex-start;
          margin-left: 20px;
        }
        
        .view-product-btn {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          background-color: #eee;
          color: #555;
          border-radius: 5px;
          font-size: 13px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .view-product-btn:hover {
          background-color: var(--theme-color);
          color: white;
        }
        
        .view-product-btn i {
          margin-right: 5px;
          font-size: 12px;
        }
        
        .order-summary {
          margin-top: 20px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 8px;
          border-left: 3px solid var(--theme-color);
        }
        
        .summary-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
          color: #555;
        }
        
        .summary-line.total {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px dashed #ddd;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        
        .summary-line.total span:last-child {
          color: var(--theme-color);
        }
        
        @media (max-width: 767px) {
          .order-detail-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .order-status-badge {
            margin-top: 10px;
          }
          
          .order-info-grid {
            grid-template-columns: 1fr;
          }
          
          .order-item {
            flex-direction: column;
          }
          
          .product-image {
            margin-right: 0;
            margin-bottom: 15px;
            width: 100%;
            height: 120px;
          }
          
          .product-action {
            margin-left: 0;
            margin-top: 15px;
            width: 100%;
          }
          
          .view-product-btn {
            width: 100%;
            justify-content: center;
          }
        }
        
        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
          margin-right: 8px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .payment-error-alert {
          margin-top: 20px;
          padding: 12px 16px;
          background-color: #ffebee;
          color: #c62828;
          border-radius: 5px;
          border-left: 4px solid #c62828;
          display: flex;
          align-items: center;
        }
        
        .payment-error-alert i {
          margin-right: 10px;
          font-size: 18px;
        }
        
        .payment-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .payment-success-alert {
          margin-bottom: 20px;
          padding: 16px;
          background-color: #e8f5e9;
          color: #2e7d32;
          border-radius: 8px;
          border-left: 4px solid #2e7d32;
          display: flex;
          align-items: center;
          animation: fadeIn 0.5s ease-in-out;
        }
        
        .payment-success-alert i {
          margin-right: 10px;
          font-size: 20px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .cancel-success-alert {
          display: flex;
          align-items: center;
          background-color: #e8f5e9;
          color: #2e7d32;
          padding: 15px 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #2e7d32;
        }
        
        .cancel-success-alert i {
          font-size: 20px;
          margin-right: 10px;
          color: #2e7d32;
        }
        
        .cancel-error-alert {
          display: flex;
          align-items: center;
          background-color: #ffebee;
          color: #c62828;
          padding: 15px 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #c62828;
        }
        
        .cancel-error-alert i {
          font-size: 20px;
          margin-right: 10px;
          color: #c62828;
        }
        
        .loading-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Custom Alerts */
        .alert-custom {
          display: flex;
          align-items: stretch;
          border-radius: 12px;
          margin-bottom: 25px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          animation: slideDown 0.4s ease-out forwards;
          transform-origin: top center;
        }
        
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .alert-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          font-size: 24px;
        }
        
        .alert-content {
          padding: 16px 20px;
          flex-grow: 1;
        }
        
        .alert-content h4 {
          margin: 0 0 5px 0;
          font-size: 17px;
          font-weight: 600;
        }
        
        .alert-content p {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
        }
        
        .alert-success-custom {
          background-color: #f0f9f0;
          border-left: 5px solid #4caf50;
        }
        
        .alert-success-custom .alert-icon {
          background-color: rgba(76, 175, 80, 0.1);
          color: #4caf50;
        }
        
        .alert-danger-custom {
          background-color: #fef5f5;
          border-left: 5px solid #f44336;
        }
        
        .alert-danger-custom .alert-icon {
          background-color: rgba(244, 67, 54, 0.1);
          color: #f44336;
        }
        
        @media (max-width: 576px) {
          .alert-custom {
            flex-direction: column;
          }
          
          .alert-icon {
            padding: 15px 0 0 0;
          }
        }
        
        /* Existing alerts styles can be removed or kept as fallback */
        .payment-success-alert,
        .cancel-success-alert,
        .cancel-error-alert,
        .payment-error-alert {
          display: none; /* Hide old alerts */
        }

        /* Cancel Modal */
        .cancel-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }
        
        .cancel-modal {
          width: 90%;
          max-width: 500px;
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
          animation: scaleIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .cancel-modal-header {
          background-color: #ffebee;
          color: #c62828;
          padding: 20px;
          text-align: center;
          border-bottom: 1px solid #ffcdd2;
        }
        
        .cancel-modal-header i {
          font-size: 40px;
          margin-bottom: 10px;
          display: block;
        }
        
        .cancel-modal-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }
        
        .cancel-modal-body {
          padding: 25px;
          text-align: center;
        }
        
        .cancel-modal-body p {
          margin: 0 0 15px 0;
          color: #555;
          font-size: 15px;
          line-height: 1.5;
        }
        
        .cancel-modal-body p:last-child {
          margin-bottom: 0;
          color: #888;
          font-size: 14px;
        }
        
        .cancel-modal-footer {
          padding: 15px 25px 25px;
          display: flex;
          justify-content: center;
          gap: 15px;
        }
        
        .cancel-modal-close-btn, 
        .cancel-modal-confirm-btn {
          padding: 12px 25px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-size: 15px;
          min-width: 130px;
        }
        
        .cancel-modal-close-btn {
          background-color: #f5f5f5;
          color: #333;
        }
        
        .cancel-modal-close-btn:hover {
          background-color: #e0e0e0;
        }
        
        .cancel-modal-confirm-btn {
          background-color: #c62828;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .cancel-modal-confirm-btn:hover {
          background-color: #b71c1c;
          box-shadow: 0 4px 8px rgba(198, 40, 40, 0.2);
        }
        
        .cancel-modal-confirm-btn:disabled,
        .cancel-modal-close-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        @media (max-width: 576px) {
          .cancel-modal-footer {
            flex-direction: column;
          }
          
          .cancel-modal-close-btn, 
          .cancel-modal-confirm-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderDetailPage; 