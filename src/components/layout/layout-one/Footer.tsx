"use client";
import { Fade } from "react-awesome-reveal";
import { Col, Row, Container } from "react-bootstrap";
import ScrollButton from "../../button/ScrollButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter, usePathname } from "next/navigation";
import { setSelectedCategory } from "@/store/reducers/filterReducer";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  image_url: string;
}

function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { selectedCategory } = useSelector((state: RootState) => state.filter);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5001/api/categories/getAll");
        setCategories(response.data.data);
        setError(false);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getDisplayCategories = () => {
    return categories.length > 8 ? categories.slice(0, 8) : categories;
  };

  const handleCategoryChange = (category: string) => {
    const updatedCategory = selectedCategory.includes(category)
      ? selectedCategory.filter((cat) => cat !== category)
      : [...selectedCategory, category];
    dispatch(setSelectedCategory(updatedCategory));
    router.push("/shop-left-sidebar-col-3");
  };

  // Kiểm tra nếu đang ở trang đăng nhập hoặc đăng ký thì không hiển thị
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  if (loading) return <div className="loading-placeholder"></div>;
  if (error) return <div className="error-message">Failed to load categories</div>;

  const displayCategories = getDisplayCategories();

  return (
    <>
      <footer className="gi-footer mt-5 pt-5 pb-3">
        <Container>
          <Row className="mb-5">
            <Col lg={6}>
              <h5 className="footer-title mb-4">Danh Mục Sản Phẩm</h5>
              <Row>
                {displayCategories.map((category) => (
                  <Col xs={6} sm={4} key={category._id} className="mb-3">
                    <a
                      className="footer-link"
                      href="#"
                      onClick={() => handleCategoryChange(category.name)}
                    >
                      {category.name}
                    </a>
                  </Col>
                ))}
              </Row>
            </Col>
            
            <Col lg={6}>
              <div className="ps-lg-5">
                <h5 className="footer-title mb-4">Liên Hệ Với Chúng Tôi</h5>
                <ul className="contact-list">
                  <li className="d-flex mb-3">
                    <div className="icon-wrapper me-3">
                      <i className="fi fi-rr-marker"></i>
                    </div>
                    <div>
                      Vinmar Center 268 Tô Hiến Thành, P.15, Q.10, TP.HCM
                    </div>
                  </li>
                  <li className="d-flex mb-3">
                    <div className="icon-wrapper me-3">
                      <i className="fi fi-brands-whatsapp"></i>
                    </div>
                    <a href="tel:+84377556677">+84 377 556 677</a>
                  </li>
                  <li className="d-flex mb-3">
                    <div className="icon-wrapper me-3">
                      <i className="fi fi-rr-envelope"></i>
                    </div>
                    <a href="mailto:support@webshop.vn">support@webshop.vn</a>
                  </li>
                </ul>

                <h5 className="footer-title mt-5 mb-4">Kết Nối Với Chúng Tôi</h5>
                <div className="social-icons">
                  <a href="#" className="me-3">
                    <i className="gicon gi-facebook"></i>
                  </a>
                  <a href="#" className="me-3">
                    <i className="gicon gi-twitter"></i>
                  </a>
                  <a href="#" className="me-3">
                    <i className="gicon gi-linkedin"></i>
                  </a>
                  <a href="#" className="me-3">
                    <i className="gicon gi-instagram"></i>
                  </a>
                </div>
              </div>
            </Col>
          </Row>
          
          <div className="footer-bottom text-center py-3 mt-4 border-top">
            <p className="mb-0">
              Copyright © <Link className="site-name" href="/">WebShop</Link> all rights reserved. 2024.
            </p>
          </div>
        </Container>
      </footer>
      <ScrollButton />
      
      <style jsx global>{`
        .gi-footer {
          background-color: #f8f9fa;
        }
        
        .footer-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #333;
          text-transform: capitalize;
        }
        
        .footer-link {
          color: #555;
          text-decoration: none;
          text-transform: capitalize;
          display: block;
          transition: color 0.2s;
        }
        
        .footer-link:hover {
          color: #007bff;
        }
        
        .contact-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .contact-list a {
          color: #555;
          text-decoration: none;
          transition: color 0.2s;
        }
        
        .contact-list a:hover {
          color: #007bff;
        }
        
        .icon-wrapper {
          width: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          color: #555;
        }
        
        .social-icons a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 50%;
          color: #555;
          transition: all 0.3s ease;
        }
        
        .social-icons a:hover {
          background: #007bff;
          color: white;
          transform: translateY(-3px);
        }
        
        .footer-bottom {
          color: #777;
        }
        
        .site-name {
          color: #007bff;
          text-decoration: none;
        }
        
        .loading-placeholder {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .error-message {
          color: #dc3545;
          text-align: center;
          padding: 20px;
        }
        
        @media (max-width: 991px) {
          .ps-lg-5 {
            padding-left: 0 !important;
            margin-top: 2rem;
          }
        }
      `}</style>
    </>
  );
}

export default Footer;
