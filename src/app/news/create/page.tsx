"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import "../news.css";

export default function CreateNews() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    author: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.title.trim()) {
        toast.error("Vui lòng nhập tiêu đề tin tức");
        setLoading(false);
        return;
      }

      if (!formData.content.trim()) {
        toast.error("Vui lòng nhập nội dung tin tức");
        setLoading(false);
        return;
      }

      // Submit form
      const response = await axios.post(
        "http://localhost:5001/api/news/create",
        formData
      );

      if (response.data.success) {
        toast.success("Thêm tin tức thành công!");
        setTimeout(() => {
          router.push("/news");
        }, 2000);
      } else {
        toast.error("Thêm tin tức thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm tin tức:", error);
      toast.error("Có lỗi xảy ra khi thêm tin tức");
    } finally {
      setLoading(false);
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
      <div className="news-form-container">
        <div className="page-header">
          <h1>Thêm Tin Tức Mới</h1>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label htmlFor="title">Tiêu Đề <span className="required">*</span></label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Nhập tiêu đề tin tức"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Nội Dung <span className="required">*</span></label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Nhập nội dung tin tức"
                  rows={8}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl">URL Hình Ảnh</label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Nhập URL hình ảnh"
                />
                {formData.imageUrl && (
                  <div className="image-preview">
                    <img src={formData.imageUrl} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="author">Tác Giả</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Nhập tên tác giả"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => router.push("/news")}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Tạo Tin Tức"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
} 