"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import "./news.css";

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  createdAt: string;
}

const listNews = async () => {
  try {
    const response = await axios.get("http://localhost:5001/api/news/getAll");
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tin tức:", error);
    toast.error("Có lỗi xảy ra khi lấy danh sách tin tức");
    return [];
  }
}

export default function NewsList() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const news = await listNews();
        setNewsItems(news);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tin tức:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  const handleDelete = async (_id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin tức này không?')) {
      try {
        await axios.delete(`http://localhost:5001/api/news/delete/${_id}`);
        setNewsItems(newsItems.filter(item => item._id !== _id));
        toast.success('Xóa tin tức thành công!');
      } catch (error) {
        console.error('Lỗi khi xóa tin tức:', error);
        toast.error('Có lỗi xảy ra khi xóa tin tức!');
      }
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
      <div className="news-list-container">
        <div className="page-header">
          <h1>Quản Lý Tin Tức</h1>
          <Link href="/news/create" className="btn btn-primary">
            <FaPlus /> Thêm Tin Tức
          </Link>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Tiêu Đề</th>
                      <th>Hình Ảnh</th>
                      <th>Tác Giả</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsItems
                      .filter((item) =>
                        item.title.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((item) => (
                        <tr key={item._id}>
                          <td>
                            <div className="news-title" title={item.title}>
                              {item.title.length > 50 ? `${item.title.substring(0, 50)}...` : item.title}
                            </div>
                          </td>
                          <td>
                            {item.imageUrl ? (
                              <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                className="news-thumbnail"
                              />
                            ) : (
                              <div className="no-image">Không có hình</div>
                            )}
                          </td>
                          <td>{item.author || "Không có tác giả"}</td>
                          <td>
                            <div className="action-buttons">
                              <Link
                                href={`/news/edit/${item._id}`}
                                className="btn btn-icon btn-warning"
                                title="Chỉnh sửa"
                              >
                                <FaEdit />
                              </Link>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="btn btn-icon btn-danger"
                                title="Xóa"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {newsItems.length === 0 && !loading && (
                      <tr>
                        <td colSpan={4} className="text-center">
                          Không có tin tức nào
                        </td>
                      </tr>
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