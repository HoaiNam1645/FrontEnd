"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import "../../category.css";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
}

export default function EditCategory({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Category>({
    _id: "",
    name: "",
    description: "",
    status: "active",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/categories/getById/${params.id}`);
        setFormData(response.data.data);
      } catch (error: any) {
        setError(error.response?.data?.message || "Có lỗi xảy ra khi lấy thông tin danh mục");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/categories/update/${params.id}`, formData);
      router.push("/category");
      router.refresh();
    } catch (error: any) {
      setError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật danh mục");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="category-form-container">
      <div className="page-header">
        <Link href="/category" className="btn btn-secondary">
          <FaArrowLeft /> Quay lại
        </Link>
        <h1>Chỉnh Sửa Danh Mục</h1>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="form">
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="name">Tên Danh Mục</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
                placeholder="Nhập tên danh mục"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Mô Tả</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                rows={4}
                required
                placeholder="Nhập mô tả danh mục"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Trạng Thái</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Cập Nhật Danh Mục
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 