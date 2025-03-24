"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../../admin.css";
import axios from "axios";
import { use } from 'react';

interface EditAdminProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditAdmin({ params }: EditAdminProps) {
  const router = useRouter();
  const { id } = use(params);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    status: "active",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/get/${id}`);
        const userData = response.data.data;
        setFormData({
          fullName: userData.fullName,
          email: userData.email,
          role: userData.role,
          status: userData.status,
          phone: userData.phone,
          address: userData.address,
        });
        console.log("userData:", userData);
        console.log("userData:", userData.role);

      } catch (error) {
        console.error("Lỗi khi lấy thông tin admin:", error);
        setError("Không thể tải thông tin admin");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/users/update/${id}`, formData);
      alert("Cập nhật thông tin admin thành công!");
      router.push("/admin");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin admin:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin admin!");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <div className="admin-form">Đang tải...</div>;
  }

  if (error) {
    return <div className="admin-form">{error}</div>;
  }

  return (
    <div className="admin-form">
      <div className="page-header">
        <h1>Cập Nhật Thông Tin Quản Trị Viên</h1>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">
                Họ và tên
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-control"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">
                  Địa chỉ
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="role">
                Chức vụ
              </label>
              <select
                id="role"
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">
                Trạng thái
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>

            <div className="form-actions">
              <Link href="/admin" className="btn btn-secondary">
                Hủy
              </Link>
              <button type="submit" className="btn btn-primary">
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 