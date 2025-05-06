"use client";
import { Col, Row } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";
import TopRatedProduct from "./grocery-item/TopRatedProduct";
import SellingProduct from "./grocery-item/SellingProduct";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/button/Spinner";
import { API_DOMAIN } from "@/components/shop-sidebar/Shop";

// Define the structure of the API response
interface TopProductsData {
  bestSelling: any[];
  topRated: any[];
}

const Trending = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topProducts, setTopProducts] = useState<TopProductsData>({
    bestSelling: [],
    topRated: []
  });

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_DOMAIN}/api/products/top`);
        
        if (response.data.success && response.data.data) {
          const data = response.data.data;
          
          // Giới hạn mỗi danh sách tối đa 3 sản phẩm, không lọc trùng lặp
          setTopProducts({
            bestSelling: data.bestSelling.slice(0, 3),
            topRated: data.topRated.slice(0, 3)
          });
        } else {
          setError("Không thể tải sản phẩm hàng đầu");
        }
      } catch (err) {
        console.error("Error fetching top products:", err);
        setError("Lỗi khi tải sản phẩm hàng đầu");
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (error) return <div className="container py-5 text-center">{error}</div>;
  if (loading) return <div className="container py-5 text-center"><Spinner /></div>;

  return (
    <div>
      <section className="gi-offer-section padding-tb-40">
        <div className="container">
          <Row>
            {/* <!-- Banner --> */}
            <Col
              xl={4}
              lg={4}
              md={12}
              sm={12}
              className="col-xs-12 gi-all-product-content gi-new-product-content wow fadeInUp"
            >
              <Fade triggerOnce direction="up" className="gi-banner-inner">
                <div className="gi-banner-block gi-banner-block-1" style={{ height: '100%' }}>
                  <div className="banner-block" style={{ height: '100%' }}>
                    <div className="banner-content" style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'center',
                      height: '100%',
                      padding: '40px 20px'
                    }}>
                      <div className="banner-text">
                        <span className="gi-banner-title" style={{ fontSize: '28px', marginBottom: '20px', display: 'block' }}>
                          Sản phẩm hàng đầu được khách hàng yêu thích
                        </span>
                        <p style={{ fontSize: '16px', marginBottom: '25px', color: '#666' }}>
                          Khám phá các sản phẩm bán chạy nhất và được đánh giá cao nhất của chúng tôi
                        </p>
                      </div>
                      <a href="/shop-left-sidebar-col-3" className="gi-btn-2">
                        Mua ngay
                      </a>
                    </div>
                  </div>
                </div>
              </Fade>
            </Col>

            {/* <!-- Top Rated --> */}
            <Col
              xl={4}
              lg={4}
              md={6}
              sm={12}
            >
              <TopRatedProduct products={topProducts.topRated} />
            </Col>

            {/* <!-- Top Selling --> */}
            <Col
              xl={4}
              lg={4}
              md={6}
              sm={12}
            >
              <SellingProduct products={topProducts.bestSelling} />
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
};

export default Trending;
