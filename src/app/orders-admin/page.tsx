"use client";

import { useEffect, useState } from "react";
import { FaCheck, FaEye, FaTimes, FaClock, FaTruck, FaCog } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminRoute from "@/components/protected-route/AdminRoute";
import "./orders-admin.css";
import { getApiUrl } from "@/config/api";

interface Order {
  _id: string;
  userId: string;
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled" | "shipped";
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("login_token");
    const response = await axios.get(getApiUrl("orders/getAll"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
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

function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data || []);
      setLoading(false);
    };
    getOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus as any } : order
        )
      );
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!");
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "status-badge pending";
      case "processing":
        return "status-badge processing";
      case "shipped":
        return "status-badge shipped";
      case "completed":
        return "status-badge completed";
      case "cancelled":
        return "status-badge cancelled";
      default:
        return "status-badge";
    }
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

  return (
    <>
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
        style={{ marginTop: '60px' }}
      />
      <div className="admin-list-container">
        <div className="page-header">
          <h1>Quản Lý Đơn Hàng</h1>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng theo ID, khách hàng, trạng thái..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID Đơn Hàng</th>
                      <th>ID Khách Hàng</th>
                      <th>Tổng Tiền</th>
                      <th>Phương Thức Thanh Toán</th>
                      <th>Ngày Tạo</th>
                      <th>Cập Nhật Lần Cuối</th>
                      <th>Trạng Thái</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center">
                          Không tìm thấy đơn hàng nào
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order._id}>
                          <td>{order._id}</td>
                          <td>{order.userId}</td>
                          <td>{formatCurrency(order.totalAmount)}</td>
                          <td>{order.paymentMethod}</td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>{formatDate(order.updatedAt)}</td>
                          <td>
                            <span className={getStatusBadgeClass(order.status)}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td>
                            <div className="status-buttons">
                              <button
                                className={`status-btn pending ${order.status === "pending" ? "active" : ""}`}
                                onClick={() => handleStatusChange(order._id, "pending")}
                                title="Chờ xử lý"
                                disabled={order.status === "pending"}
                              >
                                <FaClock />
                              </button>
                              <button
                                className={`status-btn processing ${order.status === "processing" ? "active" : ""}`}
                                onClick={() => handleStatusChange(order._id, "processing")}
                                title="Đang xử lý"
                                disabled={order.status === "processing"}
                              >
                                <FaCog />
                              </button>
                              <button
                                className={`status-btn shipped ${order.status === "shipped" ? "active" : ""}`}
                                onClick={() => handleStatusChange(order._id, "shipped")}
                                title="Đã gửi hàng"
                                disabled={order.status === "shipped"}
                              >
                                <FaTruck />
                              </button>
                              <button
                                className={`status-btn completed ${order.status === "completed" ? "active" : ""}`}
                                onClick={() => handleStatusChange(order._id, "completed")}
                                title="Hoàn thành"
                                disabled={order.status === "completed"}
                              >
                                <FaCheck />
                              </button>
                              <button
                                className={`status-btn cancelled ${order.status === "cancelled" ? "active" : ""}`}
                                onClick={() => handleStatusChange(order._id, "cancelled")}
                                title="Đã hủy"
                                disabled={order.status === "cancelled"}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Bọc component chính bằng AdminRoute để phân quyền
export default function OrdersAdminPage() {
  return (
    <AdminRoute>
      <OrdersList />
    </AdminRoute>
  );
} 