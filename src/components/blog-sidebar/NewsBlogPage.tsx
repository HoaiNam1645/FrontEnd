"use client";
import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import axios from "axios";
import Spinner from "../button/Spinner";
import Link from "next/link";

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  createdAt: string;
}

const NewsBlogPage = ({ order = "", lg = 12 }: any) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const itemsPerPage = 6;

  // Tải danh sách tin tức từ API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5001/api/news/getAll");
        if (response.data.success) {
          setNews(response.data.data);
        } else {
          setError("Không thể tải tin tức");
        }
      } catch (error) {
        console.error("Lỗi khi tải tin tức:", error);
        setError("Có lỗi xảy ra khi tải tin tức");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Tính toán tổng số trang
  const totalPages = Math.ceil(
    news.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / itemsPerPage
  );

  // Lấy dữ liệu cho trang hiện tại
  const getCurrentPageData = () => {
    const filteredNews = news.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNews.slice(startIndex, startIndex + itemsPerPage);
  };

  // Xử lý khi thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Xử lý khi tìm kiếm
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSubmit = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  // Format date từ ISO string sang dd/mm/yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Cắt ngắn nội dung cho phần hiển thị
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <>
      <Col lg={lg} md={12} className={`gi-blogs-rightside ${order}`}>
        {loading ? (
          <div className="text-center py-5">
            <Spinner />
            <p className="mt-3">Đang tải tin tức...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">
            {error}
          </div>
        ) : (
          <>
            {/* Blog content Start */}
            <div className="gi-blogs-content">
              <div className="gi-blogs-inner">
                <div className="row">
                  {getCurrentPageData().map((item: NewsItem) => (
                    <Col md={6} sm={12} key={item._id} className="mb-4">
                      <div className="gi-blog-item news-card">
                        <div className="blog-info">
                          <figure className="blog-img">
                            {item.imageUrl ? (
                              <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                className="img-fluid rounded"
                              />
                            ) : (
                              <div className="placeholder-img rounded">
                                <i className="gicon gi-image"></i>
                              </div>
                            )}
                          </figure>
                          <div className="detail">
                            <div className="news-meta">
                              <span className="news-date">
                                <i className="gicon gi-calendar me-1"></i>
                                {formatDate(item.createdAt)}
                              </span>
                              {item.author && (
                                <span className="news-author">
                                  <i className="gicon gi-user me-1"></i>
                                  {item.author}
                                </span>
                              )}
                            </div>
                            <h3 className="news-title">
                              <Link href={`/blog-detail-left-sidebar?id=${item._id}`}>
                                {item.title}
                              </Link>
                            </h3>
                            <p className="news-excerpt">
                              {truncateContent(item.content)}
                            </p>
                            <div className="more-info">
                              <Link href={`/blog-detail-left-sidebar?id=${item._id}`} className="read-more">
                                Xem thêm <i className="gicon gi-angle-double-right"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </div>
              </div>
            </div>
            {/* Blog content End */}

            {/* Pagination Start */}
            {getCurrentPageData().length === 0 ? (
              <div className="empty-news text-center py-5">
                <i className="gicon gi-search mb-3" style={{ fontSize: '48px', color: '#ddd' }}></i>
                <h4>Không tìm thấy tin tức nào</h4>
                <p>Vui lòng thử tìm kiếm với từ khóa khác</p>
              </div>
            ) : (
              <div className="gi-pro-pagination">
                <span>
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, news.filter(item => 
                    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.content.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length)} của {news.filter(item => 
                    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.content.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length} tin tức
                </span>
                <div className="gi-pro-pagination-inner">
                  <ul className="gi-pagination pagination-rounded">
                    <li className={currentPage === 1 ? "disabled" : ""}>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}>
                        <i className="gicon gi-chevron-left"></i>
                      </a>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li key={page} className={page === currentPage ? "active" : ""}>
                        <a href="#" onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}>
                          {page}
                        </a>
                      </li>
                    ))}
                    <li className={currentPage === totalPages ? "disabled" : ""}>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}>
                        <i className="gicon gi-chevron-right"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {/* Pagination End */}
          </>
        )}
      </Col>

      {/* Sidebar Area Start */}
      <Col lg={4} md={12} className="gi-blogs-sidebar gi-blogs-leftside">
        <div className="gi-blog-search">
          <div className="gi-blog-search-form">
            <input
              style={{ boxShadow: "none" }}
              className="form-control"
              placeholder="Tìm kiếm tin tức..."
              type="text"
              value={searchInput}
              onChange={handleSearch}
              onKeyDown={handleKeyPress}
            />
            <button onClick={handleSubmit} className="submit" type="button">
              <i className="gicon gi-search"></i>
            </button>
          </div>
        </div>
        
        <div className="gi-blog-sidebar-wrap">
          {/* Sidebar Recent Blog Block */}
          <div className="gi-sidebar-block gi-sidebar-recent-blog">
            <div className="gi-sb-title">
              <h3 className="gi-sidebar-title">Tin Tức Mới Nhất</h3>
            </div>
            <div className="gi-blog-block-content gi-sidebar-dropdown">
              <ul className="gi-recent-blog-list">
                {news.slice(0, 5).map((item) => (
                  <li key={item._id} className="recent-blog-item">
                    <div className="recent-blog-img">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} />
                      ) : (
                        <div className="placeholder-img-small">
                          <i className="gicon gi-image"></i>
                        </div>
                      )}
                    </div>
                    <div className="recent-blog-content">
                      <div className="recent-blog-title">
                        <Link href={`/blog-detail-left-sidebar?id=${item._id}`}>
                          {item.title}
                        </Link>
                      </div>
                      <div className="recent-blog-date">
                        <i className="gicon gi-calendar"></i> {formatDate(item.createdAt)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Col>

      <style jsx global>{`
        .news-card {
          border-radius: 10px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          overflow: hidden;
          height: 100%;
          background-color: #fff;
        }
        
        .news-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .news-card .blog-img {
          overflow: hidden;
          margin-bottom: 0;
          height: 220px;
        }
        
        .news-card .blog-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .news-card:hover .blog-img img {
          transform: scale(1.05);
        }
        
        .placeholder-img {
          width: 100%;
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          color: #adb5bd;
          font-size: 24px;
        }
        
        .placeholder-img-small {
          width: 90px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          color: #adb5bd;
          font-size: 18px;
          border-radius: 4px;
        }
        
        .news-card .detail {
          padding: 20px;
        }
        
        .news-meta {
          display: flex;
          justify-content: flex-start;
          gap: 15px;
          margin-bottom: 10px;
          font-size: 13px;
          color: #6c757d;
        }
        
        .news-title {
          font-size: 18px;
          margin-bottom: 10px;
          line-height: 1.4;
          font-weight: 600;
        }
        
        .news-title a {
          color: #333;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .news-title a:hover {
          color: #ff6e61;
        }
        
        .news-excerpt {
          font-size: 14px;
          line-height: 1.6;
          color: #666;
          margin-bottom: 15px;
        }
        
        .read-more {
          color: #ff6e61;
          font-weight: 500;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
        }
        
        .read-more:hover {
          color: #e74c3c;
        }
        
        .read-more i {
          margin-left: 5px;
          transition: transform 0.3s ease;
        }
        
        .read-more:hover i {
          transform: translateX(5px);
        }
        
        .gi-sidebar-recent-blog {
          background-color: #fff;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        
        .gi-sidebar-title {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 10px;
        }
        
        .gi-sidebar-title:after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 50px;
          height: 2px;
          background-color: #ff6e61;
        }
        
        .gi-recent-blog-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .recent-blog-item {
          display: flex;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }
        
        .recent-blog-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .recent-blog-img {
          width: 90px;
          height: 90px;
          margin-right: 15px;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .recent-blog-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .recent-blog-content {
          flex: 1;
        }
        
        .recent-blog-title {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
          margin-bottom: 8px;
        }
        
        .recent-blog-title a {
          color: #333;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .recent-blog-title a:hover {
          color: #ff6e61;
        }
        
        .recent-blog-date {
          font-size: 12px;
          color: #6c757d;
        }
        
        .recent-blog-date i {
          margin-right: 5px;
        }
        
        .gi-blog-search {
          margin-bottom: 30px;
        }
        
        .gi-blog-search-form {
          position: relative;
        }
        
        .gi-blog-search-form input {
          padding: 12px 20px;
          border-radius: 30px;
          border: 1px solid #e2e8f0;
          width: 100%;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .gi-blog-search-form input:focus {
          border-color: #ff6e61;
          box-shadow: 0 0 0 3px rgba(255, 110, 97, 0.1);
        }
        
        .gi-blog-search-form .submit {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        
        .gi-blog-search-form .submit:hover {
          color: #ff6e61;
        }
        
        @media (max-width: 767px) {
          .news-card .blog-img {
            height: 180px;
          }
          
          .news-card .detail {
            padding: 15px;
          }
          
          .news-title {
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default NewsBlogPage; 