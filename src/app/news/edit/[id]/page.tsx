"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import "../../news.css";
import { ClipLoader } from 'react-spinners';
import Link from 'next/link';

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

      if (!formData.imageUrl.trim()) {
        toast.error("Vui lòng nhập URL hình ảnh");
        setIsLoading(false);
        return;
      }

      if (!formData.author.trim()) {
        toast.error("Vui lòng nhập tên tác giả");
        setIsLoading(false);
        return;
      }

      // Submit form
      const response = await axios.put(
        `http://localhost:5001/api/news/update/${id}`,
        formData
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
      <div className="p-4 flex justify-center items-center min-h-[60vh]">
        <ClipLoader color="#123abc" size={50} />
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
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Chỉnh Sửa Tin Tức</h1>
          <Link href="/news">
            <button className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
              Quay lại danh sách tin tức
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
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
              <label htmlFor="imageUrl">URL Hình Ảnh <span className="required">*</span></label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="form-control"
                placeholder="Nhập URL hình ảnh"
                required
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
    </>
  );
};

export default EditNews; 