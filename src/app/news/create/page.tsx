"use client";

import { useState, useRef } from "react";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
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

      // Create FormData to handle file upload
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("content", formData.content);
      submitData.append("author", formData.author || "");
      
      // If there's a file selected, append it to the FormData
      if (selectedFile) {
        submitData.append("image", selectedFile);
      } else if (formData.imageUrl) {
        // If no file but URL provided, use the URL
        submitData.append("imageUrl", formData.imageUrl);
      }

      // Submit form with FormData
      const response = await axios.post(
        "http://localhost:5001/api/news/create",
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
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
            <form onSubmit={handleSubmit} className="form" encType="multipart/form-data">
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
                <label htmlFor="image">Hình Ảnh</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleFileChange}
                    className="form-control"
                    accept="image/*"
                    ref={fileInputRef}
                  />
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Chọn Tệp
                  </button>
                  <span className="file-name">
                    {selectedFile ? selectedFile.name : "Chưa chọn tệp nào"}
                  </span>
                </div>
                {previewUrl && (
                  <div className="image-preview">
                    <img src={previewUrl} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl">Hoặc URL Hình Ảnh</label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Nhập URL hình ảnh (nếu không tải lên tệp)"
                />
                {formData.imageUrl && !previewUrl && (
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