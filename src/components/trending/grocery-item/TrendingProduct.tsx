import { Fade } from "react-awesome-reveal";
import { Col } from "react-bootstrap";
import Slider from "react-slick";
import TrendingItem from "../trendingItem/TrendingItem";
import Spinner from "@/components/button/Spinner";
import { useEffect, useState } from "react";
import { Product, productService } from "@/services/productService";

const TrendingProduct = ({
  onSuccess = () => {},
  hasPaginate = false,
  onError = () => {},
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const settings = {
    dots: false,
    infinite: true,
    rows: 3,
    arrows: true,
    autoplay: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
          rows: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          rows: 3,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          rows: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          rows: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          rows: 2,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        console.log('Products data received in TrendingProduct component:', data);
        setProducts(data || []);
        onSuccess();
      } catch (err) {
        setError("Không thể tải sản phẩm");
        console.error('Error in TrendingProduct component:', err);
        onError();
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (error) return <div>Không thể tải sản phẩm</div>;
  if (loading) return <Spinner />;

  return (
    <Col
      xl={3}
      lg={6}
      md={6}
      sm={12}
      className="col-xs-6 gi-all-product-content gi-new-product-content mt-767-40 wow fadeInUp"
    >
      <Fade triggerOnce direction="up" delay={400}>
        <Col md={12}>
          <div className="section-title">
            <div className="section-detail">
              <h2 className="gi-title">
                Sản phẩm <span>bán chạy</span>
              </h2>
            </div>
          </div>
        </Col>
        <Slider {...settings} className="gi-trending-slider">
          {products.map((item: Product) => (
            <TrendingItem key={item._id} data={item} />
          ))}
        </Slider>
      </Fade>
    </Col>
  );
};

export default TrendingProduct;
