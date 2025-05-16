"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import "../../news.css";
import { ClipLoader } from 'react-spinners';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
}

const EditNews = () => {
  const params = useParams();
  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : '';
  const router = useRouter();
  
  const [formData, setFormData] = useState<NewsItem>({
    _id: id,
    title: "",
    content: "",
    imageUrl: "",
    author: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        setIsFetching(true);
        // Gọi API để lấy thông tin tin tức
        const response = await axios.get(`http://localhost:5001/api/news/get/${id}`);
        
        if (response.data.success) {
          const newsData = response.data.data;
          
          setFormData({
            _id: id,
            title: newsData.title || "",
            content: newsData.content || "",
            imageUrl: newsData.imageUrl || "",
            author: newsData.author || ""
          });
          
          // Set image preview if image URL exists
          if (newsData.imageUrl) {
            setPreviewUrl(newsData.imageUrl);
          }
        } else {
          setError("Không thể tải thông tin tin tức");
          toast.error("Không thể tải thông tin tin tức");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin tin tức:", error);
        setError("Có lỗi xảy ra khi tải thông tin tin tức");
        toast.error("Có lỗi xảy ra khi tải thông tin tin tức");
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchNewsItem();
    }
  }, [id]);

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
      // Reset to original image URL if available
      setPreviewUrl(formData.imageUrl || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.title.trim()) {
        toast.error("Vui lòng nhập tiêu đề tin tức");
        setIsLoading(false);
        return;
      }

      if (!formData.content.trim()) {
        toast.error("Vui lòng nhập nội dung tin tức");
        setIsLoading(false);
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
        `http://localhost:5001/api/news/update/${id}`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success("Cập nhật tin tức thành công!");
        setTimeout(() => {
          router.push("/news");
        }, 2000);
      } else {
        toast.error("Cập nhật tin tức thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật tin tức:", error);
      toast.error("Có lỗi xảy ra khi cập nhật tin tức");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="loading-spinner">
        <ClipLoader color="#4299e1" size={50} />
        <p>Đang tải thông tin tin tức...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Lỗi</h2>
        <p>{error}</p>
        <button 
          className="btn btn-primary" 
          onClick={() => router.push("/news")}
        >
          Quay lại danh sách tin tức
        </button>
      </div>
    );
  }

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
          <h1>Chỉnh Sửa Tin Tức</h1>
          <Link href="/news" className="btn btn-secondary">
            <FaArrowLeft /> Quay lại danh sách
          </Link>
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
                    {selectedFile ? selectedFile.name : "Sử dụng ảnh hiện tại hoặc chọn ảnh mới"}
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
              </div>

              <div className="form-group">
                <label htmlFor="author">Tác Giả <span className="required">*</span></label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Nhập tên tác giả"
                  required
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
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <ClipLoader color="#ffffff" size={20} className="mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Cập Nhật Tin Tức"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditNews; 