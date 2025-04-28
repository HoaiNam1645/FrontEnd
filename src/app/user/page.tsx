"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import axios from "axios";
import "./user.css";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
  joinDate: string;
}

const listUsers = async () => {
  try {
    const response = await axios.get("http://localhost:5001/api/users/getAll");
    console.log('resposne', response.data.data);

    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    return [];
  }
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await listUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (_id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      try {
        await axios.delete(`http://localhost:5001/api/users/delete/${_id}`);
        // Cập nhật danh sách users sau khi xóa thành công
        setUsers(users.filter(user => user._id !== _id));
        alert('Xóa người dùng thành công!');
      } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        alert('Có lỗi xảy ra khi xóa người dùng!');
      }
    }
  };

  return (
    <div className="user-list-container">
      <div className="page-header">
        <h1>Quản Lý Người Dùng</h1>
        <Link href="/user/create" className="btn btn-primary">
          <FaPlus /> Thêm Người Dùng
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
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
                  <th>SỐ ĐIỆN THOẠI</th>
                  <th>ĐỊA CHỈ</th>
                  <th>CHỨC VỤ</th>
                  <th>TRẠNG THÁI</th>
                  <th>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {users.filter((user) => user.role !== "admin").map((user) => (
                  <tr key={user._id}>
                    <td key={`name-${user._id}`}>{user.fullName}</td>
                    <td key={`email-${user._id}`}>{user.email}</td>
                    <td key={`phone-${user._id}`}>{user.phone}</td>
                    <td key={`address-${user._id}`}>{user.address}</td>
                    <td>
                      <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td key={`status-${user._id}`}>
                      <span className={`status-badge ${user.status}`}>
                        {user.status === "active" ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td key={`actions-${user._id}`}>
                      <div className="action-buttons">
                        
                        <Link
                          key={`edit-${user._id}`}
                          href={`/user/edit/${user._id}`}
                          className="btn btn-icon btn-warning"
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          key={`delete-${user._id}`}
                          onClick={() => handleDelete(user._id)}
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
