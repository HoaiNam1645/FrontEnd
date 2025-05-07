"use client";

import { useEffect, useState } from "react";
import { FaCheck, FaEye, FaTimes, FaClock, FaTruck, FaCog, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminRoute from "@/components/protected-route/AdminRoute";
import "./orders-admin.css";
import { getApiUrl } from "@/config/api";
import Link from "next/link";

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

const deleteOrder = async (orderId: string) => {
  try {
    const token = localStorage.getItem("login_token");
    await axios.delete(`${getApiUrl("orders/delete")}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

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

  const handleDeleteOrder = async (orderId: string) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    
    try {
      await deleteOrder(orderToDelete);
      setOrders(orders.filter(order => order._id !== orderToDelete));
      toast.success("Xóa đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
      toast.error("Có lỗi xảy ra khi xóa đơn hàng!");
    } finally {
      setShowDeleteModal(false);
      setOrderToDelete(null);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <FaExclamationTriangle className="warning-icon" />
              <h3>Xác nhận xóa đơn hàng</h3>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-btn cancel-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setOrderToDelete(null);
                }}
              >
                Hủy
              </button>
              <button 
                className="modal-btn delete-btn"
                onClick={confirmDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

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
                      <th>Người Nhận</th>
                      <th>Địa Chỉ</th>
                      <th>Số Điện Thoại</th>
                      <th>Tổng Tiền</th>
                      <th>Phương Thức Thanh Toán</th>
                      <th>Trạng Thái</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center">
                          Không tìm thấy đơn hàng nào
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order._id}>
                          <td>{order.recipientName}</td>
                          <td>{order.address}</td>
                          <td>{order.phoneNumber}</td>
                          <td>{formatCurrency(order.totalAmount)}</td>
                          <td>{order.paymentMethod}</td>
                          <td>
                            <span className={getStatusBadgeClass(order.status)}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td>
                            <div className="status-buttons">
                              <select
                                className="status-select"
                                value={order.status}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              >
                                <option value="pending">Chờ xử lý</option>
                                <option value="processing">Đang xử lý</option>
                                <option value="shipped">Đã gửi hàng</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                              </select>
                              <Link 
                                href={`/orders-admin/view/${order._id}`}
                                className="view-btn"
                                title="Xem chi tiết"
                              >
                                <FaEye />
                              </Link>
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