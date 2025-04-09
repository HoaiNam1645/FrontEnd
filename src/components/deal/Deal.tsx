"use client";
import { Col, Row } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ItemCard from "../product-item/ItemCard";
import { Fade } from "react-awesome-reveal";
import DealendTimer from "../dealend-timer/DealendTimer";
import Spinner from "../button/Spinner";
import React, { useEffect, useState } from "react";
import { productService, Product } from "@/services/productService";

const Deal = ({
  onSuccess = () => {},
  hasPaginate = false,
  onError = () => {},
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const useSampleData = false;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        if (useSampleData) {
          const sampleData = productService.getSampleProducts();
          setProducts(sampleData);
          console.log(`Đã tải ${sampleData.length} sản phẩm mẫu thành công`);
          onSuccess();
          setLoading(false);
          return;
        }
        
        // Gọi API sản phẩm
        const apiData = await productService.getAllProducts();
        
        if (apiData && apiData.length > 0) {
          // Kiểm tra các trường dữ liệu quan trọng
          const validProducts = apiData.filter(product => 
            product && product._id && product.name && 
            typeof product.price === 'number'
          );
          
          
          if (validProducts.length > 0) {
            setProducts(validProducts);
            
          } else {
            console.error('Deal component: Không tìm thấy sản phẩm hợp lệ');
            setError("Không có sản phẩm hợp lệ");
          }
        } else {
          console.error('Deal component: Dữ liệu sản phẩm trống hoặc không đúng định dạng');
          setError("Không có sản phẩm nào được tìm thấy");
        }
        
        onSuccess();
      } catch (err) {
        setError("Không thể tải sản phẩm");
        console.error('Error in Deal component:', err);
        onError();
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (error) return <div>⚠️ {error}</div>;
  if (loading) return <Spinner />;

  return (
    <section
      className="gi-deal-section padding-tb-40 wow fadeInUp"
      data-wow-duration="2s"
    >
      <div className="container">
        <Row className="overflow-hidden m-b-minus-24px">
          <Col lg={12} className="gi-deal-section col-lg-12">
            <div className="gi-products">
              <div
                className="section-title"
                data-aos="fade-up"
                data-aos-duration="2000"
                data-aos-delay="200"
              >
                <Fade triggerOnce direction="up" duration={2000} delay={200}>
                  <div className="section-detail">
                    <h2 className="gi-title">
                      Ngày <span>siêu ưu đãi</span>
                    </h2>
                    <p>Đừng chờ đợi. Thời gian sẽ không bao giờ vừa đúng.</p>
                  </div>
                </Fade>
                <DealendTimer />
              </div>
              <Fade
                triggerOnce
                direction="up"
                duration={2000}
                delay={200}
                className="gi-deal-block m-minus-lr-12"
              >
                <div className="deal-slick-carousel gi-product-slider slick-initialized slick-slider">
                  <div className="slick-list draggable">
                    {products.length > 0 ? (
                      <Swiper
                        loop={products.length > 1}
                        autoplay={products.length > 1 ? { delay: 3000 } : false}
                        slidesPerView={1}
                        spaceBetween={20}
                        centeredSlides={products.length === 1}
                        breakpoints={{
                          640: { 
                            slidesPerView: products.length === 1 ? 1 : Math.min(2, products.length),
                            spaceBetween: 20 
                          },
                          768: { 
                            slidesPerView: products.length === 1 ? 1 : Math.min(3, products.length),
                            spaceBetween: 20 
                          },
                          1024: { 
                            slidesPerView: products.length === 1 ? 1 : Math.min(4, products.length),
                            spaceBetween: 20 
                          },
                          1200: { 
                            slidesPerView: products.length === 1 ? 1 : Math.min(5, products.length),
                            spaceBetween: 20 
                          },
                        }}
                        className="slick-track"
                        style={{
                          display: 'flex',
                          justifyContent: products.length < 4 ? 'center' : 'flex-start',
                          padding: products.length === 1 ? '0 20%' : '0'
                        }}
                      >
                        {products.map((item) => (
                          <SwiperSlide 
                            key={item._id} 
                            className="slick-slide"
                            style={{
                              width: products.length === 1 ? '100%' : 'auto',
                              maxWidth: products.length === 1 ? '500px' : 'none',
                              margin: products.length === 1 ? '0 auto' : undefined
                            }}
                          >
                            <ItemCard data={item} />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        Không có sản phẩm nào được tìm thấy
                      </div>
                    )}
                  </div>
                </div>
              </Fade>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Deal;
