import { Fade } from "react-awesome-reveal";
import Slider from "react-slick";
import TrendingItem from "../trendingItem/TrendingItem";
import { Product } from "@/services/productService";

interface TopRatedProductProps {
  products?: Product[];
  onSuccess?: () => void;
  hasPaginate?: boolean;
  onError?: () => void;
}

const TopRatedProduct = ({
  products = [],
  onSuccess = () => {},
  hasPaginate = false,
  onError = () => {},
}: TopRatedProductProps) => {
  // Tính toán số hàng dựa trên số lượng sản phẩm
  const rowsToShow = Math.min(products.length, 3);
  
  const settings = {
    dots: false,
    infinite: false, // Tắt infinite để tránh nhân bản
    rows: rowsToShow || 1, // Sử dụng số hàng dựa trên số lượng sản phẩm
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
          rows: rowsToShow || 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          rows: rowsToShow || 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          rows: rowsToShow || 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          rows: Math.min(rowsToShow, 2) || 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          rows: Math.min(rowsToShow, 2) || 1,
        },
      },
    ],
  };

  if (!products || products.length === 0) {
    return (
      <div className="gi-all-product-content gi-new-product-content mt-1199-40 wow fadeInUp">
        <Fade triggerOnce direction="up" delay={600} className="">
          <div className="section-title">
            <div className="section-detail">
              <h2 className="gi-title">
                Top <span>Được đánh giá</span>
              </h2>
            </div>
          </div>
          <div className="text-center py-4">Không có sản phẩm</div>
        </Fade>
      </div>
    );
  }

  // Kiểm tra console để xác nhận số lượng sản phẩm
  console.log('TopRatedProduct - Số lượng sản phẩm:', products.length, products.map(p => p.name));

  return (
    <div className="gi-all-product-content gi-new-product-content mt-1199-40 wow fadeInUp">
      <Fade triggerOnce direction="up" delay={600} className="">
        <div className="section-title">
          <div className="section-detail">
            <h2 className="gi-title">
              Top <span>Được đánh giá</span>
            </h2>
          </div>
        </div>
        <Slider {...settings} className="gi-trending-slider">
          {products.map((item: Product, index: number) => (
            <TrendingItem key={`${item._id}-${index}`} data={item} />
          ))}
        </Slider>
      </Fade>
    </div>
  );
};

export default TopRatedProduct;
