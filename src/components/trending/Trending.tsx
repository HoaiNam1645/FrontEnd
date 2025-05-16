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
          <Row className="justify-content-center">
            {/* <!-- Top Rated --> */}
            <Col
              xl={6}
              lg={6}
              md={6}
              sm={12}
              className="mb-4"
            >
              
              <TopRatedProduct products={topProducts.topRated} />
            </Col>

            {/* <!-- Top Selling --> */}
            <Col
              xl={6}
              lg={6}
              md={6}
              sm={12}
              className="mb-4"
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
