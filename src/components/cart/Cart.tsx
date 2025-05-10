"use client";
import { useEffect, useState, FormEvent } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ItemCard from "../product-item/ItemCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { removeCartItemAsync, fetchCartFromAPI, createOrderAsync } from "../../store/reducers/cartSlice";
import { Fade } from "react-awesome-reveal";
import Spinner from "../button/Spinner";
import DiscountCoupon from "../discount-coupon/DiscountCoupon";
import QuantitySelector from "../quantity-selector/QuantitySelector";
import Link from "next/link";
import { productService, Product } from "../../services/productService";
import { AppDispatch } from "../../store";
import { CreateOrderRequest, OrderItemRequest, CartItem } from "../../services/cartService";
import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast } from "../toast-popup/Toastify";
import { Modal } from "../modal/Modal";
import { toast } from "react-toastify";

// Thêm hàm showWarningToast vì nó chưa được export từ file Toastify
const showWarningToast = (message: string) => {
  toast.warning(message);
};

const Cart = ({
  onSuccess = () => {},
  hasPaginate = false,
  onError = () => {},
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const loading = useSelector((state: RootState) => state.cart.loading);
  const error = useSelector((state: RootState) => state.cart.error);
  
  const [subTotal, setSubTotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [recipientName, setRecipientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const router = useRouter();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', onConfirm: () => {} });
  
  // Lấy user ID từ localStorage khi component mount
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        // Lấy thông tin người dùng từ localStorage
        const userInfoStr = localStorage.getItem('login_user');
        if (!userInfoStr) {
          console.log('Người dùng chưa đăng nhập');
          return;
        }
        
        const userInfo = JSON.parse(userInfoStr);
        if (!userInfo || !userInfo.id) {
          console.log('Không tìm thấy ID người dùng');
          return;
        }
        
        // Kiểm tra token có tồn tại không
        const token = localStorage.getItem('login_token');
        if (!token) {
          console.log('Token không tồn tại hoặc đã hết hạn');
          // Thông báo cho người dùng đăng nhập lại
          showWarningToast('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
          // Có thể chuyển hướng đến trang đăng nhập
          return;
        }
        
        console.log('Đang lấy giỏ hàng cho người dùng ID:', userInfo.id);
        await dispatch(fetchCartFromAPI(userInfo.id));
      } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
        // Hiển thị thông báo lỗi cụ thể
        if (error.response && error.response.status === 401) {
          showWarningToast('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        } else {
          showErrorToast('Có lỗi xảy ra khi tải giỏ hàng, vui lòng thử lại sau');
        }
      }
    };
    
    fetchCartData();
  }, [dispatch]);

  useEffect(() => {
    if (loading || cartItems.length === 0) {
      setSubTotal(0);
      setVat(0);
      return;
    }

    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubTotal(subtotal);
    // Calculate VAT
    const vatAmount = subtotal * 0.1; // 10% VAT cho Việt Nam
    setVat(vatAmount);
  }, [cartItems, loading]);

  const handleDiscountApplied = (discount) => {
    setDiscount(discount);
  };

  const discountAmount = subTotal * (discount / 100);
  const total = subTotal + vat - discountAmount;

  const handleRemoveFromCart = (item: CartItem) => {
    // Mở modal xác nhận thay vì window.confirm
    setModalContent({
      title: 'Xác nhận xóa',
      message: `Bạn có chắc muốn xóa sản phẩm "${item.name}" khỏi giỏ hàng?`,
      onConfirm: () => {
        
        dispatch(removeCartItemAsync(item._id))
          .unwrap()
          .then(() => {
            setIsModalOpen(false);
          })
          .catch((error) => {
            showErrorToast(error || "Có lỗi xảy ra khi xóa sản phẩm");
            setIsModalOpen(false);
          });
      }
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    const loadProducts = async () => {
      setProductsLoading(true);
      try {
        const products = await productService.getAllProducts();
        setNewProducts(products);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        // Sử dụng dữ liệu mẫu nếu có lỗi
        setNewProducts(productService.getSampleProducts());
      } finally {
        setProductsLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  const handleCreateOrder = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (!recipientName || !phoneNumber || !address) {
      showWarningToast("Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }
    
    if (cartItems.length === 0) {
      showWarningToast("Giỏ hàng của bạn đang trống!");
      return;
    }
    
    // Lấy thông tin người dùng từ localStorage
    const userInfoStr = localStorage.getItem('login_user');
    if (!userInfoStr) {
      showWarningToast('Bạn cần đăng nhập để tạo đơn hàng');
      return;
    }
    
    const userInfo = JSON.parse(userInfoStr);
    if (!userInfo || !userInfo.id) {
      showErrorToast('Không tìm thấy ID người dùng');
      return;
    }
    
    // Chuẩn bị danh sách sản phẩm cho đơn hàng
    const orderItemList: OrderItemRequest[] = cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      name: item.name,
      price: item.price
    }));
    
    // Tạo đối tượng đơn hàng
    const orderData: CreateOrderRequest = {
      userId: userInfo.id,
      totalAmount: total,
      status: "pending",
      address,
      phoneNumber,
      recipientName,
      orderItemList
    };
    
    dispatch(createOrderAsync(orderData))
      .unwrap()
      .then(() => {
        // Chuyển hướng đến trang xác nhận đơn hàng hoặc trang chủ
        showSuccessToast('Đơn hàng đã được tạo thành công!');
        router.push('/order-success');
      })
      .catch((error) => {
        console.error('Lỗi khi tạo đơn hàng:', error);
        showErrorToast(`Đã xảy ra lỗi khi tạo đơn hàng: ${error}`);
      });
  };

  if (productsLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {/* Modal component for confirmations */}
      {isModalOpen && (
        <Modal 
          title={modalContent.title}
          message={modalContent.message}
          onConfirm={modalContent.onConfirm}
          onCancel={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
        />
      )}
      
      <section className="gi-cart-section padding-tb-40">
        <h2 className="d-none">Cart Page</h2>
        <div className="container">
          {!loading && cartItems.length === 0 && !error ? (
            <div
              style={{
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "300",
              }}
              className="gi-pro-content cart-pro-title"
            >
              {" "}
              Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng.
            </div>
          ) : (
            <div className="row">
              {/* <!-- Sidebar Area Start --> */}
              <div className="gi-cart-rightside col-lg-4 col-md-12">
                <div className="gi-sidebar-wrap">
                  {/* <!-- Sidebar Summary Block --> */}
                  <div className="gi-sidebar-block">
                    <div className="gi-sb-title">
                      <h3 className="gi-sidebar-title">Tóm tắt</h3>
                    </div>
                    <div className="gi-sb-block-content">
                      <h4 className="gi-ship-title">Thông tin giao hàng</h4>
                      <div className="gi-cart-form">
                        <p>Nhập thông tin giao hàng của bạn</p>
                        <form action="#" method="post">
                          <span className="gi-cart-wrap">
                            <label>Họ và tên người nhận *</label>
                            <input
                              type="text"
                              name="recipient_name"
                              placeholder="Nhập họ và tên người nhận"
                              required
                              value={recipientName}
                              onChange={(e) => setRecipientName(e.target.value)}
                            />
                          </span>
                          <span className="gi-cart-wrap">
                            <label>Số điện thoại người nhận *</label>
                            <input
                              type="tel"
                              name="recipient_phone"
                              placeholder="Nhập số điện thoại người nhận"
                              required
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                          </span>
                          <span className="gi-cart-wrap">
                            <label>Địa chỉ giao hàng *</label>
                            <textarea
                              name="delivery_address"
                              placeholder="Nhập địa chỉ giao hàng đầy đủ"
                              rows={3}
                              required
                              style={{
                                width: '100%',
                                padding: '8px 15px',
                                borderRadius: '5px',
                                border: '1px solid #e5e5e5',
                                fontSize: '14px',
                                resize: 'none'
                              }}
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                            ></textarea>
                          </span>
                        </form>
                      </div>
                    </div>

                    <div className="gi-sb-block-content">
                      <div className="gi-cart-summary-bottom">
                        <div className="gi-cart-summary">
                          <div>
                            <span className="text-left">Tạm tính</span>
                            <span className="text-right">
                              {new Intl.NumberFormat('vi-VN', { 
                                style: 'currency', 
                                currency: 'VND' 
                              }).format(subTotal)}
                            </span>
                          </div>
                          <div>
                            <span className="text-left">VAT (10%)</span>
                            <span className="text-right">
                              {new Intl.NumberFormat('vi-VN', { 
                                style: 'currency', 
                                currency: 'VND' 
                              }).format(vat)}
                            </span>
                          </div>
                          <div>
                            <DiscountCoupon
                              onDiscountApplied={handleDiscountApplied}
                            />
                          </div>
                          <div className="gi-cart-coupan-content">
                            <form
                              className="gi-cart-coupan-form"
                              name="gi-cart-coupan-form"
                              method="post"
                              action="#"
                            >
                              <input
                                className="gi-coupan"
                                type="text"
                                required
                                placeholder="Nhập mã giảm giá của bạn"
                                name="gi-coupan"
                                defaultValue=""
                              />
                              <button
                                className="gi-btn-2"
                                type="submit"
                                name="subscribe"
                                defaultValue=""
                              >
                                Áp dụng
                              </button>
                            </form>
                          </div>
                          <div className="gi-cart-summary-total">
                            <span className="text-left">Tổng cộng</span>
                            <span className="text-right">
                              {new Intl.NumberFormat('vi-VN', { 
                                style: 'currency', 
                                currency: 'VND' 
                              }).format(total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="gi-cart-leftside col-lg-8 col-md-12 m-t-991">
                {/* <!-- cart content Start --> */}
                <div className="gi-cart-content">
                  <div className="gi-cart-inner">
                    <div className="row">
                      <form action="#">
                        <div className="table-content cart-table-content">
                          <table>
                            <thead>
                              <tr>
                                <th>Sản phẩm</th>
                                <th>Giá</th>
                                <th style={{ textAlign: "center" }}>
                                  Số lượng
                                </th>
                                <th>Thành tiền</th>
                                <th>Hành động</th>
                              </tr>
                            </thead>
                            <tbody>
                              {loading ? (
                                <tr>
                                  <td colSpan={5} style={{ textAlign: 'center' }}>
                                    <Spinner />
                                    <p>Đang tải giỏ hàng...</p>
                                  </td>
                                </tr>
                              ) : error ? (
                                <tr>
                                  <td colSpan={5} style={{ textAlign: 'center', color: 'red' }}>
                                    Có lỗi khi tải giỏ hàng: {error}
                                  </td>
                                </tr>
                              ) : cartItems && cartItems.length > 0 ? (
                                cartItems.map((item: CartItem, index: number) => (
                                  <tr key={index}>
                                    <td
                                      data-label="Sản phẩm"
                                      className="gi-cart-pro-name"
                                    >
                                      <Link href={`/product-left-sidebar/${item.productId}`}>
                                        <img
                                          className="gi-cart-pro-img mr-4"
                                          src={item.image_url}
                                          alt={item.name}
                                        />
                                        {item.name}
                                      </Link>
                                    </td>
                                    <td
                                      data-label="Giá"
                                      className="gi-cart-pro-price"
                                    >
                                      <span className="amount">
                                        {new Intl.NumberFormat('vi-VN', { 
                                          style: 'currency', 
                                          currency: 'VND' 
                                        }).format(item.price)}
                                      </span>
                                    </td>
                                    <td
                                      data-label="Số lượng"
                                      className="gi-cart-pro-qty"
                                      style={{ textAlign: "center" }}
                                    >
                                      <div className="cart-qty-plus-minus">
                                        <QuantitySelector
                                          quantity={item.quantity}
                                          id={item._id}
                                        />
                                      </div>
                                    </td>
                                    <td
                                      data-label="Thành tiền"
                                      className="gi-cart-pro-subtotal"
                                    >
                                      {new Intl.NumberFormat('vi-VN', { 
                                        style: 'currency', 
                                        currency: 'VND' 
                                      }).format(item.price * item.quantity)}
                                    </td>
                                    <td
                                      onClick={() => handleRemoveFromCart(item)}
                                      data-label="Remove"
                                      className="gi-cart-pro-remove"
                                    >
                                      <a href="#">
                                        <i className="gicon gi-trash-o"></i>
                                      </a>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={5} style={{ textAlign: 'center' }}>
                                    Giỏ hàng trống
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="gi-cart-update-bottom">
                              <Link href="/">Tiếp tục mua sắm</Link>
                              <Link href="/checkout" className="gi-btn-2" onClick={handleCreateOrder}>
                                Tạo Đơn Hàng
                              </Link>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {/* <!--cart content End --> */}
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="gi-new-product padding-tb-40">
        <div className="container">
          <div className="row overflow-hidden m-b-minus-24px">
            <div className="gi-new-prod-section col-lg-12">
              <div className="gi-products">
                <Fade
                  triggerOnce
                  direction="up"
                  duration={2000}
                  delay={200}
                  className="section-title-2"
                  data-aos="fade-up"
                  data-aos-duration="2000"
                  data-aos-delay="200"
                >
                  <div>
                    <h2 className="gi-title">
                      Sản phẩm <span>Mới</span>
                    </h2>
                    <p>Khám phá bộ sưu tập sản phẩm hàng đầu</p>
                  </div>
                </Fade>
                <Fade
                  triggerOnce
                  direction="up"
                  duration={2000}
                  delay={200}
                  data-aos="fade-up"
                  data-aos-duration="2000"
                  data-aos-delay="300"
                >
                  <div className="gi-new-block m-minus-lr-12">
                  <Swiper
                    loop={true}
                    autoplay={{ delay: 1000 }}
                    slidesPerView={5}
                    breakpoints={{
                      0: {
                        slidesPerView: 1,
                      },
                      320: {
                        slidesPerView: 1,
                        spaceBetween: 25,
                      },
                      426: {
                        slidesPerView: 2,
                      },
                      640: {
                        slidesPerView: 2,
                      },
                      768: {
                        slidesPerView: 3,
                      },
                      1024: {
                        slidesPerView: 3,
                      },
                      1025: {
                        slidesPerView: 5,
                      },
                    }}
                    className="deal-slick-carousel gi-product-slider"
                  >
                    {newProducts.map((item: Product, index: number) => (
                      <SwiperSlide key={index}>
                        <ItemCard data={item} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  </div>
                </Fade>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
