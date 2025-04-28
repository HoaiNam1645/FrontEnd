"use client";
import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import axios from "axios";
import { useSearchParams } from "next/navigation";
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

const NewsDetail = ({ order = "" }: any) => {
  const searchParams = useSearchParams();
  const newsId = searchParams?.get("id");
  
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [recentNews, setRecentNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tải chi tiết tin tức từ API
  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!newsId) {
        setError("Không tìm thấy tin tức");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/api/news/get/${newsId}`);
        
        if (response.data.success) {
          setNewsItem(response.data.data);
        } else {
          setError("Không thể tải thông tin tin tức");
        }
      } catch (error) {
        console.error("Lỗi khi tải tin tức:", error);
        setError("Có lỗi xảy ra khi tải tin tức");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [newsId]);

  // Tải danh sách tin tức liên quan
  useEffect(() => {
    const fetchRecentNews = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/news/getAll");
        
        if (response.data.success) {
          // Lọc ra 5 tin tức khác với tin tức hiện tại
          const filteredNews = response.data.data
            .filter((item: NewsItem) => item._id !== newsId)
            .slice(0, 5);
          
          setRecentNews(filteredNews);
        }
      } catch (error) {
        console.error("Lỗi khi tải tin tức liên quan:", error);
      }
    };

    fetchRecentNews();
  }, [newsId]);

  // Format date từ ISO string sang dd/mm/yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Format content để hiển thị xuống dòng
  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="news-paragraph">
        {paragraph}
      </p>
    ));
  };

  return (
    <>
      <Col lg={9} md={12} className={`gi-blogs-rightside ${order}`}>
        {loading ? (
          <div className="text-center py-5">
            <Spinner />
            <p className="mt-3">Đang tải thông tin tin tức...</p>
          </div>
        ) : error ? (
          <div className="error-container text-center py-5">
            <i className="gicon gi-exclamation-circle" style={{ fontSize: '48px', color: '#dc3545', marginBottom: '20px' }}></i>
            <h3>{error}</h3>
            <p className="mb-4">Tin tức bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
            <Link href="/blog-left-sidebar" className="back-btn">
              <i className="gicon gi-arrow-left me-2"></i> Quay lại trang tin tức
            </Link>
          </div>
        ) : newsItem ? (
          <div className="news-detail-container">
            <div className="news-detail-header">
              <h1 className="news-detail-title">{newsItem.title}</h1>
              
              <div className="news-detail-meta">
                <div className="news-detail-date">
                  <i className="gicon gi-calendar me-2"></i>
                  {formatDate(newsItem.createdAt)}
                </div>
                
                {newsItem.author && (
                  <div className="news-detail-author">
                    <i className="gicon gi-user me-2"></i>
                    {newsItem.author}
                  </div>
                )}
              </div>
            </div>
            
            {newsItem.imageUrl && (
              <div className="news-detail-image">
                <img 
                  src={newsItem.imageUrl} 
                  alt={newsItem.title} 
                  className="img-fluid rounded"
                />
              </div>
            )}
            
            <div className="news-detail-content">
              {formatContent(newsItem.content)}
            </div>
            
            <div className="news-detail-footer">
              <div className="news-detail-share">
                <span className="share-label">Chia sẻ:</span>
                <div className="share-buttons">
                  <a href="#" className="share-button facebook">
                    <i className="gicon gi-facebook"></i>
                  </a>
                  <a href="#" className="share-button twitter">
                    <i className="gicon gi-twitter"></i>
                  </a>
                  <a href="#" className="share-button linkedin">
                    <i className="gicon gi-linkedin"></i>
                  </a>
                </div>
              </div>
              
              <Link href="/blog-left-sidebar" className="back-to-news">
                <i className="gicon gi-arrow-left me-2"></i> Quay lại trang tin tức
              </Link>
            </div>
          </div>
        ) : null}
      </Col>

      {/* Sidebar Area Start */}
      <Col lg={3} md={12} className="gi-blogs-sidebar gi-blogs-leftside">
        <div className="gi-blog-sidebar-wrap">
          {/* Sidebar Recent Blog Block */}
          <div className="gi-sidebar-block gi-sidebar-recent-blog">
            <div className="gi-sb-title">
              <h3 className="gi-sidebar-title">Tin Tức Khác</h3>
            </div>
            <div className="gi-blog-block-content gi-sidebar-dropdown">
              {recentNews.length > 0 ? (
                <ul className="gi-recent-blog-list">
                  {recentNews.map((item) => (
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
              ) : (
                <p className="text-center py-4">Không có tin tức liên quan</p>
              )}
            </div>
          </div>
        </div>
      </Col>

      <style jsx global>{`
        .news-detail-container {
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
          padding: 30px;
          margin-bottom: 30px;
        }
        
        .news-detail-header {
          margin-bottom: 25px;
        }
        
        .news-detail-title {
          font-size: 32px;
          font-weight: 700;
          color: #333;
          line-height: 1.3;
          margin-bottom: 15px;
        }
        
        .news-detail-meta {
          display: flex;
          align-items: center;
          gap: 20px;
          color: #6c757d;
          font-size: 14px;
        }
        
        .news-detail-date, .news-detail-author {
          display: flex;
          align-items: center;
        }
        
        .news-detail-image {
          margin: 0 -30px 25px;
          height: 350px;
          overflow: hidden;
        }
        
        .news-detail-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .news-detail-content {
          color: #333;
          font-size: 17px;
          line-height: 1.8;
          margin-bottom: 30px;
        }
        
        .news-paragraph {
          margin-bottom: 20px;
        }
        
        .news-detail-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        
        .news-detail-share {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .share-label {
          font-weight: 500;
          color: #555;
        }
        
        .share-buttons {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .share-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          color: white;
          transition: all 0.3s ease;
        }
        
        .share-button.facebook {
          background-color: #3b5998;
        }
        
        .share-button.twitter {
          background-color: #1da1f2;
        }
        
        .share-button.linkedin {
          background-color: #0a66c2;
        }
        
        .share-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        }
        
        .back-to-news {
          display: inline-flex;
          align-items: center;
          padding: 10px 20px;
          background-color: #f8f9fa;
          color: #555;
          border-radius: 5px;
          font-weight: 500;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .back-to-news:hover {
          background-color: #ff6e61;
          color: white;
        }
        
        .error-container {
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
          padding: 40px 30px;
        }
        
        .back-btn {
          display: inline-flex;
          align-items: center;
          padding: 10px 20px;
          background-color: #ff6e61;
          color: white;
          border-radius: 5px;
          font-weight: 500;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .back-btn:hover {
          background-color: #e74c3c;
          transform: translateY(-2px);
        }
        
        .gi-sidebar-recent-blog {
          background-color: #f8f9fa;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        
        .gi-sidebar-title {
          font-size: 16px;
          color: #333;
          margin-bottom: 15px;
          position: relative;
          padding-bottom: 8px;
        }
        
        .gi-sidebar-title:after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 40px;
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
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #eee;
        }
        
        .recent-blog-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .recent-blog-img {
          width: 70px;
          height: 70px;
          margin-right: 12px;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .recent-blog-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .placeholder-img-small {
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          color: #adb5bd;
          font-size: 16px;
          border-radius: 4px;
        }
        
        .recent-blog-content {
          flex: 1;
        }
        
        .recent-blog-title {
          font-size: 13px;
          font-weight: 500;
          line-height: 1.4;
          margin-bottom: 6px;
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
          font-size: 11px;
          color: #6c757d;
        }
        
        .recent-blog-date i {
          margin-right: 4px;
        }
        
        @media (max-width: 767px) {
          .news-detail-container {
            padding: 20px;
          }
          
          .news-detail-title {
            font-size: 24px;
          }
          
          .news-detail-image {
            margin: 0 -20px 20px;
            height: 220px;
          }
          
          .news-detail-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .news-detail-footer {
            flex-direction: column;
            gap: 15px;
          }
          
          .news-detail-share {
            width: 100%;
            justify-content: center;
          }
          
          .back-to-news {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default NewsDetail; 