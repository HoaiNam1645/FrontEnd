"use client";
import { RootState } from "@/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { cartService, OrderDetail } from "@/services/cartService";
import Spinner from "../button/Spinner";

const OrderStatusBadge = ({ status }: { status: string }) => {
  let badgeClass = "";
  let statusText = "";
  let icon = "";

  switch (status) {
    case "pending":
      badgeClass = "badge-primary";
      statusText = "Chờ xử lý";
      icon = "fi fi-rs-time-forward";
      break;
    case "processing":
      badgeClass = "badge-warning";
      statusText = "Đang xử lý";
      icon = "fi fi-rs-settings";
      break;
    case "shipped":
      badgeClass = "badge-info";
      statusText = "Đang giao hàng";
      icon = "fi fi-rs-truck-side";
      break;
    case "delivered":
      badgeClass = "badge-success";
      statusText = "Đã giao hàng";
      icon = "fi fi-rs-check";
      break;
    case "canceled":
      badgeClass = "badge-danger";
      statusText = "Đã hủy";
      icon = "fi fi-rs-cross-circle";
      break;
    default:
      badgeClass = "badge-secondary";
      statusText = status;
      icon = "fi fi-rs-info";
      break;
  }

  return (
    <span className={`order-status ${badgeClass}`}>
      <i className={icon}></i> {statusText}
    </span>
  );
};

const TrackOrder = () => {
  const login = useSelector(
    (state: RootState) => state.registration.isAuthenticated
  );
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!login) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Lấy thông tin người dùng từ localStorage
        const userInfoStr = localStorage.getItem('login_user');
        if (!userInfoStr) {
          setError('Không tìm thấy thông tin người dùng');
          setLoading(false);
          return;
        }
        
        const userInfo = JSON.parse(userInfoStr);
        if (!userInfo || !userInfo.id) {
          setError('Không tìm thấy ID người dùng');
          setLoading(false);
          return;
        }
        
        const ordersData = await cartService.getUserOrders(userInfo.id);
        setOrders(ordersData);
      } catch (err) {
        console.error('Lỗi khi lấy đơn hàng:', err);
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [login]);

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

  if (!login) {
    return (
      <div className="container">
        <p>
          Vui lòng <a href="/login">đăng nhập</a> hoặc <a href="/register">đăng ký</a> để xem trang này.
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="gi-track padding-tb-40">
        <div className="container">
          <div className="section-title-2 text-center mb-5">
            <h2 className="gi-title">
              Theo Dõi<span> Đơn Hàng</span>
            </h2>
            <p>Quản lý tất cả đơn hàng của bạn tại đây.</p>
          </div>
          <div className="row">
            <div className="container">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner />
                  <p className="mt-3">Đang tải đơn hàng...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center empty-order py-5">
                  <i className="gicon gi-shopping-bag" style={{ fontSize: '50px', color: '#ddd', marginBottom: '20px' }}></i>
                  <p>Bạn chưa có đơn hàng nào.</p>
                  <a href="/" className="gi-btn-2 mt-3">Mua sắm ngay</a>
                </div>
              ) : (
                <div className="gi-order-table">
                  <div className="table-responsive">
                    <table className="table order-tracking-table">
                      <thead>
                        <tr>
                          <th>Mã đơn hàng</th>
                          <th>Ngày đặt</th>
                          <th>Người nhận</th>
                          <th>Địa chỉ</th>
                          <th>Số điện thoại</th>
                          <th>Tổng tiền</th>
                          <th>Trạng thái</th>
                          <th>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id} className="order-row">
                            <td className="order-id">
                              <span className="id-badge">#{order._id.substring(order._id.length - 8)}</span>
                            </td>
                            <td className="order-date">
                              <div className="date-info">
                                <i className="gicon gi-calendar" style={{ marginRight: '5px' }}></i>
                                {formatDate(order.createdAt)}
                              </div>
                            </td>
                            <td className="recipient-name">{order.recipientName}</td>
                            <td className="address">
                              <div className="address-info" title={order.address || ''}>
                                {order.address ? (order.address.length > 20 ? `${order.address.substring(0, 20)}...` : order.address) : 'Không có địa chỉ'}
                              </div>
                            </td>
                            <td className="phone-number">{order.phoneNumber}</td>
                            <td className="total-amount">
                              <span className="amount">
                                {new Intl.NumberFormat('vi-VN', { 
                                  style: 'currency', 
                                  currency: 'VND' 
                                }).format(order.totalAmount)}
                              </span>
                            </td>
                            <td className="status-cell">
                              <OrderStatusBadge status={order.status} />
                            </td>
                            <td className="action-cell">
                              <a href={`/order-detail/${order._id}`} className="view-detail-btn">
                                <i className="gicon gi-eye"></i> Chi tiết
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <style jsx global>{`
          .gi-order-table {
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
            border-radius: 10px;
            overflow: hidden;
            background: #fff;
          }
          
          .order-tracking-table {
            margin-bottom: 0;
          }
          
          .order-tracking-table thead {
            background: linear-gradient(to right, #f54e4e, #ff7676);
            color: white;
          }
          
          .order-tracking-table th {
            padding: 15px;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: none;
            vertical-align: middle;
          }
          
          .order-tracking-table td {
            padding: 15px;
            vertical-align: middle;
            border-bottom: 1px solid #f0f0f0;
            font-size: 14px;
            color: #333;
          }
          
          .order-row:hover {
            background-color: #f9f9f9;
            transition: all 0.3s ease;
          }
          
          .id-badge {
            background-color: #eff6ff;
            color: #1a56db;
            padding: 6px 10px;
            border-radius: 5px;
            font-weight: 600;
            font-size: 13px;
          }
          
          .order-status {
            display: inline-flex;
            align-items: center;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
          }
          
          .order-status i {
            margin-right: 5px;
            font-size: 12px;
          }
          
          .badge-primary {
            background-color: #e3f2fd;
            color: #1976d2;
            border: 1px solid #bbdefb;
          }
          
          .badge-warning {
            background-color: #fff8e1;
            color: #f59e0b;
            border: 1px solid #ffe082;
          }
          
          .badge-info {
            background-color: #e1f5fe;
            color: #0288d1;
            border: 1px solid #b3e5fc;
          }
          
          .badge-success {
            background-color: #e8f5e9;
            color: #2e7d32;
            border: 1px solid #c8e6c9;
          }
          
          .badge-danger {
            background-color: #ffebee;
            color: #c62828;
            border: 1px solid #ffcdd2;
          }
          
          .badge-secondary {
            background-color: #f5f5f5;
            color: #616161;
            border: 1px solid #e0e0e0;
          }
          
          .view-detail-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 6px 14px;
            background-color: #95a5a6;
            color: white;
            border-radius: 5px;
            transition: all 0.3s ease;
            text-decoration: none;
            font-size: 13px;
          }
          
          .view-detail-btn:hover {
            background-color: #7f8c8d;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          
          .view-detail-btn i {
            margin-right: 5px;
          }
          
          .date-info, .address-info {
            display: flex;
            align-items: center;
          }
          
          .address-info {
            max-width: 150px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .amount {
            font-weight: 600;
            color: #333;
          }
          
          .empty-order {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 50px 0;
          }
          
          @media (max-width: 767px) {
            .order-tracking-table {
              min-width: 800px;
            }
            
            .gi-order-table {
              border-radius: 0;
            }
          }
        `}</style>
      </section>
    </>
  );
};

export default TrackOrder;
