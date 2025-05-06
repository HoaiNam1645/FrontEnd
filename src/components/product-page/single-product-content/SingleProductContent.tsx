import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useSWR from "swr";
import fetcher from "../../fetcher-api/Fetcher";
import QuantitySelector from "../../quantity-selector/QuantitySelector";
import Spinner from "@/components/button/Spinner";
import ZoomImage from "@/components/zoom-image/ZoomImage";
import { Product } from "@/services/productService";
import { useDispatch, useSelector } from "react-redux";
import { addItem, updateItemQuantity, addToCartAsync } from "@/store/reducers/cartSlice";
import { RootState, AppDispatch } from "@/store";
import { showSuccessToast } from "@/components/toast-popup/Toastify";

interface SingleProductContentProps {
  onSuccess?: () => void;
  hasPaginate?: boolean;
  onError?: () => void;
  productData?: Product | null;
}

const SingleProductContent = ({
  onSuccess = () => {},
  hasPaginate = false,
  onError = () => {},
  productData = null,
}: SingleProductContentProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isSliderInitialized, setIsSliderInitialized] = useState(false);
  const initialRef: any = null;
  const slider1 = useRef<Slider | null>(initialRef);
  const slider2 = useRef<Slider | null>(initialRef);
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.registration.user);
  const cartId = useSelector((state: RootState) => state.cart.cartId);

  const slider1Settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    asNavFor: slider2.current,
    focusOnSelect: true,
  };

  const slider2Settings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: slider1.current,
    dots: false,
    arrows: true,
    focusOnSelect: true,
  };

  useEffect(() => {
    setIsSliderInitialized(true);
  }, [isSliderInitialized]);

  const handleSlider1Click = (index: any) => {
    if (slider2.current) {
      slider2.current.slickGoTo(index);
    }
  };

  const handleSlider2Click = (index: any) => {
    if (slider1.current) {
      slider1.current.slickGoTo(index);
    }
  };

  const { data, error } = useSWR("/api/productphoto", fetcher, {
    onSuccess,
    onError,
  });

  if (error) return <div>Không thể tải hình ảnh sản phẩm</div>;
  if (!data)
    return (
      <div>
        <Spinner />
      </div>
    );

  const getData = () => {
    if (hasPaginate) return data.data;
    else return data;
  };
  
  // Tạo dữ liệu ảnh từ productData nếu có
  const getProductImages = () => {
    if (productData && productData.image_url) {
      // Nếu có dữ liệu sản phẩm thì sử dụng
      return [
        { image: productData.image_url },
        { image: productData.image_url }
      ];
    }
    // Nếu không có dữ liệu sản phẩm thì sử dụng dữ liệu API
    return getData();
  };

  // Hàm xử lý thêm vào giỏ hàng
  const handleCart = () => {
    if (!productData) {
      showSuccessToast("Không tìm thấy thông tin sản phẩm!", {
        icon: false,
        type: "error"
      });
      return;
    }

    if (!user || !user.id) {
      showSuccessToast("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", {
        icon: false,
        type: "error"
      });
      return;
    }

    const isItemInCart = cartItems.some((item) => item._id === productData._id);

    if (!isItemInCart) {
      // Sử dụng API khi đã đăng nhập
      dispatch(addToCartAsync({
        userId: user.id,
        productId: productData._id,
        quantity: quantity
      }))
      .unwrap()
      .then(() => {
        // Cập nhật UI sau khi API thành công
        dispatch(addItem({ ...productData, quantity: quantity }));
        showSuccessToast("Thêm sản phẩm vào giỏ hàng thành công!");
      })
      .catch((error) => {
        showSuccessToast(error.message || "Có lỗi xảy ra khi thêm vào giỏ hàng", {
          icon: false,
          type: "error"
        });
      });
    } else {
      // Cập nhật số lượng sản phẩm đã có trong giỏ hàng
      const existingItem = cartItems.find((item) => item._id === productData._id);
      const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
      
      if (cartId) {
        // Gọi API cập nhật số lượng nếu đã có cartId
        dispatch(addToCartAsync({
          userId: user.id,
          productId: productData._id,
          quantity: newQuantity
        }))
        .unwrap()
        .then(() => {
          // Cập nhật UI sau khi API thành công
          const updatedCartItems = cartItems.map((item) =>
            item._id === productData._id
              ? {
                  ...item,
                  quantity: item.quantity + quantity
                }
              : item
          );
          dispatch(updateItemQuantity(updatedCartItems));
          showSuccessToast("Thêm sản phẩm vào giỏ hàng thành công!");
        })
        .catch((error) => {
          showSuccessToast(error.message || "Có lỗi xảy ra khi cập nhật giỏ hàng", {
            icon: false,
            type: "error"
          });
        });
      }
    }
  };

  return (
    <>
      <div className="single-pro-inner">
        <Row className="justify-content-center align-items-start g-0" style={{ margin: "0" }}>
          {isSliderInitialized && (
            <Col lg={5} md={12} className="single-pro-img text-center">
              <div className="single-product-scroll" style={{ maxWidth: "90%", margin: "0 auto" }}>
                <Slider
                  {...slider1Settings}
                  ref={(slider) => (slider1.current = slider)}
                  className="single-product-cover"
                  style={{ maxWidth: "400px", margin: "0 auto" }}
                >
                  {getProductImages().map((item: any, index: any) => (
                    <div
                      key={index}
                      className="single-slide zoom-image-hover"
                      onClick={() => handleSlider1Click(index)}
                      style={{ maxHeight: "400px", display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                      <ZoomImage
                        src={item.image}
                        alt="" 
                      />
                    </div>
                  ))}
                </Slider>
                <Slider
                  {...slider2Settings}
                  ref={(slider) => (slider2.current = slider)}
                  className="single-nav-thumb"
                  style={{ marginTop: "10px" }}
                >
                  {getProductImages().map((item: any, index: number) => (
                    <div
                      key={index}
                      className="single-slide"
                      onClick={() => handleSlider2Click(index)}
                    >
                      <img className="img-responsive" src={item.image} alt="" />
                    </div>
                  ))}
                </Slider>
              </div>
            </Col>
          )}
          <Col lg={7} md={12} className="single-pro-desc">
            <div className="single-pro-content" style={{ padding: "0 0 0 15px" }}>
              <h5 className="gi-single-title" style={{ fontSize: "28px", marginBottom: "15px", fontWeight: "600" }}>
                {productData ? productData.name : "Snack khoai tây 52g, Hương vị kem và hành tây, Giòn rụm."}
              </h5>
              <div className="gi-single-rating-wrap" style={{ marginBottom: "20px" }}>
                <div className="gi-single-rating">
                  {productData && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i 
                            key={star}
                            className={`gicon ${star <= Math.round(productData.ratingAverage || 0) ? 'gi-star fill' : 'gi-star-o'}`} 
                            style={{ fontSize: "18px", color: star <= Math.round(productData.ratingAverage || 0) ? '#ffc107' : '#ccc' }}
                          ></i>
                        ))}
                        {productData.ratingAverage ? (
                          <span style={{ marginLeft: '8px', fontSize: '16px', color: '#666' }}>
                            {productData.ratingAverage.toFixed(1)}
                          </span>
                        ) : null}
                      </div>
                    </>
                  )}
                  {!productData && (
                    <>
                      <i className="gicon gi-star fill" style={{ fontSize: "18px" }}></i>
                      <i className="gicon gi-star fill" style={{ fontSize: "18px" }}></i>
                      <i className="gicon gi-star fill" style={{ fontSize: "18px" }}></i>
                      <i className="gicon gi-star fill" style={{ fontSize: "18px" }}></i>
                      <i className="gicon gi-star-o" style={{ fontSize: "18px" }}></i>
                    </>
                  )}
                </div>
                <span className="gi-read-review" style={{ fontSize: "16px" }}>
                  |&nbsp;&nbsp;<a href="#gi-spt-nav-review">
                    {productData && productData.ratingCount !== undefined
                      ? `${productData.ratingCount} Đánh giá`
                      : "992 Đánh giá"}
                  </a>
                </span>
              </div>

              <div className="gi-single-price-stoke" style={{ marginBottom: "25px" }}>
                <div className="gi-single-price">
                  <div className="final-price" style={{ fontSize: "26px", fontWeight: "bold" }}>
                    {productData 
                      ? `${productData.price.toLocaleString()}đ` 
                      : "664.000đ"}<span className="price-des" style={{ fontSize: "16px", marginLeft: "10px" }}>-78%</span>
                  </div>
                  <div className="mrp" style={{ fontSize: "18px", marginTop: "5px" }}>
                    Giá gốc: <span>{productData 
                      ? `${(productData.price * 1.2).toLocaleString()}đ` 
                      : "2.999.000đ"}</span>
                  </div>
                </div>
                <div className="gi-single-stoke">
                  <span className="gi-single-sku" style={{ visibility: 'hidden' }}>Mã SP: {productData?._id || "WH12"}</span>
                  <span className="gi-single-ps-title" style={{ fontSize: "18px", fontWeight: "600" }}>
                    {productData 
                      ? (productData.stock > 0 ? "CÒN HÀNG" : "HẾT HÀNG") 
                      : "CÒN HÀNG"}
                  </span>
                </div>
              </div>
              <div className="gi-single-desc" style={{ marginBottom: "25px" }}>
                <p>
                  {productData ? productData.description : "Snack khoai tây nhập khẩu trực tiếp từ hãng Pringles mang tới hương vị tuyệt hảo, kết hợp giữa hương kem chua và hành tây. Mùi hương thơm mát, quyến rũ, vị cay nhẹ đặc trưng."}
                </p>
                <p>
                  <strong>Danh mục:</strong> {productData && productData.categoryId ? 
                    (typeof productData.categoryId === 'string' ? 
                      productData.categoryId : 
                      (productData.categoryId as any).name || "N/A") 
                    : "N/A"}
                </p>
              </div>

              <div className="gi-single-list" style={{ marginBottom: "25px" }}>
                <ul style={{ fontSize: "16px", lineHeight: "1.8" }}>
                  <li>
                    <strong>Số lượng trong kho:</strong> {productData ? productData.stock : "N/A"}
                  </li>
                </ul>
              </div>
              <div className="gi-single-qty">
                <div className="qty-plus-minus">
                  <QuantitySelector setQuantity={setQuantity} quantity={quantity} id={data.id} />
                </div>
                <div className="gi-single-cart">
                  <button 
                    className="btn btn-primary gi-btn-1" 
                    style={{ fontSize: "16px", padding: "10px 20px" }}
                    onClick={handleCart}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
                <div className="gi-single-wishlist">
                  <a className="gi-btn-group wishlist" title="Yêu thích">
                    <i className="fi-rr-heart"></i>
                  </a>
                </div>
                <div className="gi-single-quickview">
                  <a
                    href="#"
                    className="gi-btn-group quickview"
                    data-link-action="quickview"
                    title="Xem nhanh"
                    data-bs-toggle="modal"
                    data-bs-target="#gi_quickview_modal"
                  >
                    <i className="fi-rr-eye"></i>
                  </a>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SingleProductContent;
