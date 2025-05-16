"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash, FaEye, FaPlus, FaKey, FaUser, FaChartBar } from "react-icons/fa";
import "./admin.css";
import axios from "axios";
import AdminRoute from "@/components/protected-route/AdminRoute";
import { showSuccessToast, showErrorToast } from "@/components/toast-popup/Toastify";
import Toastify from "@/components/toast-popup/Toastify";
import ConfirmModal from "@/components/modal/ConfirmModal";

interface Admin {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
  joinDate: string;
}

const listAdmin = async () => {
  try {
    const token = localStorage.getItem("login_token");
    const response = await axios.get("http://localhost:5001/api/users/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('response', response.data.data);

    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
}

function AdminList() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      const admins = await listAdmin();
      setAdmins(admins || []);
    };
    fetchAdmins();
  }, []);

  const confirmDelete = (_id: string) => {
    setSelectedAdminId(_id);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    if (!selectedAdminId) return;
    
    try {
      const token = localStorage.getItem("login_token");
      const response = await axios.delete(`http://localhost:5001/api/users/delete/${selectedAdminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        setAdmins(admins.filter(admin => admin._id !== selectedAdminId));
        showSuccessToast('Xóa admin thành công!');
      } else {
        showErrorToast(response.data.message || 'Có lỗi xảy ra khi xóa admin!');
      }
    } catch (error) {
      console.error('Lỗi khi xóa admin:', error);
      if (error.response && error.response.data && error.response.data.message) {
        showErrorToast(error.response.data.message);
      } else {
        showErrorToast('Có lỗi xảy ra khi xóa admin!');
      }
    } finally {
      setShowConfirmModal(false);
      setSelectedAdminId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setSelectedAdminId(null);
  };

  return (
    <div className="admin-list-container">
      <Toastify />
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa admin này không?"
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />
      <div className="page-header">
        <h1>Quản Lý Admin</h1>
        <div>
          <Link href="/analytics" className="btn btn-primary me-2">
            <FaChartBar /> Thống kê
          </Link>
          <Link href="/admin/profile" className="btn btn-secondary me-2">
            <FaUser /> Thông tin cá nhân
          </Link>
          <Link href="/admin/create" className="btn btn-primary">
            <FaPlus /> Thêm Admin
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc chức vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Số Điện Thoại</th>
                  <th>Địa Chỉ</th>
                  <th>Chức Vụ</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {admins.filter((admin) => admin.role !== "user").map((admin) => (
                  <tr key={admin._id}>
                    <td>{admin.fullName}</td>
                    <td>{admin.email}</td>
                    <td>{admin.phone}</td>
                    <td>{admin.address}</td>  
                    <td>
                      <span className="position-badge">{admin.role}</span>
                    </td>
                    <td>
                      <span className={`permission-badge ${admin.status}`}>
                        {admin.status === "active" ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          href={`/admin/edit/${admin._id}`}
                          className="btn btn-icon btn-warning"
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </Link>
                        <Link
                          href={`/admin/permissions/${admin._id}`}
                          className="btn btn-icon btn-purple"
                          title="Phân quyền"
                        >
                          <FaKey />
                        </Link>
                        <button
                          onClick={() => confirmDelete(admin._id)}
                          className="btn btn-icon btn-danger"
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Bọc component chính bằng AdminRoute để phân quyền
export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminList />
    </AdminRoute>
  );
}