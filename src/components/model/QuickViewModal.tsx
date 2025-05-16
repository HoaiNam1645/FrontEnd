import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import StarRating from "../stars/StarRating";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync, fetchCartFromAPI } from "../../store/reducers/cartSlice";
import { Fade } from "react-awesome-reveal";
import { Col, Row } from "react-bootstrap";
import QuantitySelector from "../quantity-selector/QuantitySelector";
import { RootState, AppDispatch } from "@/store";
import { showSuccessToast } from "../toast-popup/Toastify";
import ZoomImage from "@/components/zoom-image/ZoomImage";
import { Product } from "@/services/productService";
import { API_DOMAIN } from "@/components/shop-sidebar/Shop";

interface QuickViewModalProps {
  show: boolean;
  handleClose: () => void;
  data: Product;
}

const QuickViewModal = ({ show, handleClose, data }: QuickViewModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState(1);
  const isAuthenticated = useSelector((state: RootState) => state.registration.isAuthenticated);
  const user = useSelector((state: RootState) => state.registration.user);

  // Lấy số lượng sản phẩm trong giỏ hàng hiện tại
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const currentCartQuantity = cartItems.find(item => item.productId === data._id)?.quantity || 0;

  // Kiểm tra số lượng có thể thêm vào giỏ hàng
  const availableQuantity = data.stock - currentCartQuantity;

  const getImageUrl = (url: string | undefined) => {
    if (!url) return '/assets/img/product-images/1_1.jpg';
    
    if (url.startsWith('http')) {
      return url;
    }
    
    if (url.startsWith('/')) {
      return `${API_DOMAIN}${url}`;
    }
    
    return `${API_DOMAIN}/${url}`;
  };

  // Cập nhật số lượng khi thay đổi
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > availableQuantity) {
      showSuccessToast(`Chỉ còn ${availableQuantity} sản phẩm trong kho!`, {
        icon: false,
        type: "warning"
      });
      return;
    }
    setQuantity(newQuantity);
  };

  const handleCart = () => {
    if (!isAuthenticated) {
      showSuccessToast("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", {
        icon: false,
        type: "error"
      });
      return;
    }

    const userId = user?.id || user?._id;
    if (!userId) {
      showSuccessToast("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!", {
        icon: false,
        type: "error"
      });
      return;
    }

    // Kiểm tra số lượng tồn kho
    if (quantity > availableQuantity) {
      showSuccessToast(`Chỉ còn ${availableQuantity} sản phẩm trong kho!`, {
        icon: false,
        type: "warning"
      });
      return;
    }

    dispatch(addToCartAsync({
      userId: userId,
      productId: data._id,
      quantity: quantity
    }))
    .unwrap()
    .then(() => {
      dispatch(fetchCartFromAPI(userId));
      showSuccessToast("Thêm sản phẩm vào giỏ hàng thành công!");
      handleClose(); // Đóng modal sau khi thêm thành công
    })
    .catch((error) => {
      showSuccessToast(error.message || "Có lỗi xảy ra khi thêm vào giỏ hàng", {
        icon: false,
        type: "error"
      });
    });
  };

  return (
    <Fade>
      <Modal
        centered
        show={show}
        onHide={handleClose}
        keyboard={false}
        className="modal fade quickview-modal"
        id="gi_quickview_modal"
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog-centered" role="document">
          <div className="modal-content">
            <button
              type="button"
              className="btn-close qty_close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleClose}
            ></button>
            <Modal.Body>
              <Row>
                <Col md={5} sm={12} className="mb-767">
                  <div className="single-pro-img single-pro-img-no-sidebar">
                    <div className="single-product-scroll">
                      <div className="single-slide zoom-image-hover">
                        <ZoomImage src={getImageUrl(data.image_url)} alt={data.name} />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={7} sm={12}>
                  <div className="quickview-pro-content">
                    <h5 className="gi-quick-title">
                      <a href={`/product-left-sidebar/${data._id}`}>{data.name}</a>
                    </h5>
                    <div className="gi-quickview-rating">
                      <StarRating rating={data.ratingAverage || 0} />
                      <span className="rating-info" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        fontSize: '12px', 
                        color: '#777', 
                        marginLeft: '5px' 
                      }}>
                        {data?.ratingCount && data?.ratingCount > 0 ? `(${data.ratingCount} đánh giá)` : ''}
                      </span>
                    </div>

                    <div className="gi-quickview-desc">
                      {data.description}
                    </div>

                    <div className="gi-quickview-price">
                      <span className="new-price">
                        {data.price ? data.price.toLocaleString('vi-VN') : '0'}đ
                      </span>
                    </div>

                    <div className="gi-quickview-qty">
                      <div className="qty-plus-minus gi-qty-rtl">
                        <QuantitySelector
                          quantity={quantity}
                          id={data._id}
                          setQuantity={handleQuantityChange}
                          maxQuantity={availableQuantity}
                        />
                      </div>
                      <div className="gi-quickview-cart">
                        <button
                          onClick={handleCart}
                          className="gi-btn-1"
                          disabled={availableQuantity <= 0}
                        >
                          <i className="fi-rr-shopping-basket"></i> 
                          {availableQuantity <= 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                        </button>
                      </div>
                      {availableQuantity > 0 && (
                        <div className="stock-info" style={{ 
                          fontSize: '12px', 
                          color: '#666', 
                          marginTop: '5px' 
                        }}>
                          Còn {availableQuantity} sản phẩm trong kho
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          </div>
        </div>
      </Modal>
    </Fade>
  );
};

export default QuickViewModal;
