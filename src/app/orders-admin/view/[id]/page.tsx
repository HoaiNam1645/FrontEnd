"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { FaArrowLeft, FaCheck, FaClock, FaCog, FaTruck } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminRoute from "@/components/protected-route/AdminRoute";
import { getApiUrl } from "@/config/api";
import Link from "next/link";
import "./order-detail.css";

interface OrderItem {
  _id: string;
  quantity: number;
  productId: string;
  name: string;
  price: number;
  image_url: string;
}

interface Order {
  _id: string;
  userId: string;
  totalAmount: number;
  address: string;
  phoneNumber: string;
  status: "pending" | "processing" | "completed" | "cancelled" | "shipped";
  recipientName: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderDetail {
  order: Order;
  orderItemList: OrderItem[];
}

const fetchOrderDetail = async (orderId: string) => {
  try {
    const token = localStorage.getItem("login_token");
    const response = await axios.get(`${getApiUrl("orders/get")}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching order detail:", error);
    throw error;
  }
};

const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const token = localStorage.getItem("login_token");
    const response = await axios.post(
      getApiUrl("orders/update-status"),
      { 
        orderId,
        status 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrderDetail = async () => {
      try {
        const data = await fetchOrderDetail(orderId);
        setOrderDetail(data);
      } catch (error) {
        console.error("Error loading order detail:", error);
        toast.error("Không thể tải chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    getOrderDetail();
  }, [orderId]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrderDetail(prev => {
        if (!prev) return null;
        return {
          ...prev,
          order: {
            ...prev.order,
            status: newStatus as any
          }
        };
      });
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN") + " ₫";
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đã gửi hàng";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="error-container">
        <p>Không tìm thấy đơn hàng</p>
        <Link href="/orders-admin" className="back-button">
          <FaArrowLeft /> Quay lại
        </Link>
      </div>
    );
  }

  const { order, orderItemList } = orderDetail;

  return (
    <div className="order-detail-container">
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

      <div className="order-header">
        <Link href="/orders-admin" className="back-button">
          <FaArrowLeft /> Quay lại
        </Link>
        <h1>Chi tiết đơn hàng</h1>
      </div>

      <div className="order-content">
        <div className="order-info-section">
          <div className="order-status">
            <h2>Trạng thái đơn hàng</h2>
            <div className="status-control">
              <select
                className="status-select"
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đã gửi hàng</option>
                <option value="completed">Hoàn thành</option>
              </select>
              <div className="current-status">
                Trạng thái hiện tại: <span className={`status-badge ${order.status}`}>{getStatusText(order.status)}</span>
              </div>
            </div>
          </div>

          <div className="order-details">
            <h2>Thông tin đơn hàng</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Người nhận:</span>
                <span className="value">{order.recipientName}</span>
              </div>
              <div className="detail-item">
                <span className="label">Địa chỉ:</span>
                <span className="value">{order.address}</span>
              </div>
              <div className="detail-item">
                <span className="label">Số điện thoại:</span>
                <span className="value">{order.phoneNumber}</span>
              </div>
              <div className="detail-item">
                <span className="label">Phương thức thanh toán:</span>
                <span className="value">{order.paymentMethod}</span>
              </div>
              <div className="detail-item">
                <span className="label">Tổng tiền:</span>
                <span className="value total-amount">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="detail-item">
                <span className="label">Ngày tạo:</span>
                <span className="value">{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-items-section">
          <h2>Danh sách sản phẩm</h2>
          <div className="items-table">
            <table>
              <thead>
                <tr>
                  <th className="product-col">Sản phẩm</th>
                  <th className="price-col">Đơn giá</th>
                  <th className="quantity-col">Số lượng</th>
                  <th className="total-col">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {orderItemList && orderItemList.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="product-info">
                        <img src={item.image_url} alt={item.name} className="product-image" />
                        <span className="product-name">{item.name}</span>
                      </div>
                    </td>
                    <td className="price">{formatCurrency(item.price)}</td>
                    <td className="quantity">{item.quantity}</td>
                    <td className="total">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="total-label">Tổng cộng:</td>
                  <td className="total-amount">{formatCurrency(order.totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Bọc component chính bằng AdminRoute để phân quyền
export default function OrderDetailAdminPage() {
  return (
    <AdminRoute>
      <OrderDetailPage />
    </AdminRoute>
  );
} 