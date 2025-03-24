"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash, FaEye, FaPlus, FaKey } from "react-icons/fa";
import "./admin.css";
import axios from "axios";


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

const listAdmin = async ( ) => {
  try {
    const response = await axios.get("http://localhost:5000/api/users/getAll");
    console.log('resposne', response.data.data);

    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
  }
}

export default function AdminList() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      const admins = await listAdmin();
      setAdmins(admins);
    };
    fetchAdmins();
  }, []);

  const handleDelete = async (_id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa admin này không?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/delete/${_id}`);
        setAdmins(admins.filter(admin => admin._id !== _id));
        alert('Xóa admin thành công!');
      } catch (error) {
        console.error('Lỗi khi xóa admin:', error);
        alert('Có lỗi xảy ra khi xóa admin!');
      }
    }
  };

  return (
    <div className="admin-list-container">
      <div className="page-header">
        <h1>Quản Lý Admin</h1>
        <Link href="/admin/create" className="btn btn-primary">
          <FaPlus /> Thêm Admin
        </Link>
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
                          onClick={() => handleDelete(admin._id)}
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