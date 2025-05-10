import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { removeItem, fetchUserCartAsync, removeCartItemAsync, fetchCartFromAPI } from "../../store/reducers/cartSlice";
import Link from "next/link";
import QuantitySelector from "../quantity-selector/QuantitySelector";
import { showSuccessToast } from "../toast-popup/Toastify";
import { Product } from "@/services/productService";
import Spinner from "../button/Spinner";
import { AppDispatch } from "@/store";
import { CartItem } from "@/services/cartService";

interface User {
  _id: string;
  [key: string]: any;
}

const SidebarCart = ({ closeCart, isCartOpen }: any) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isAuthenticated = useSelector((state: RootState) => state.registration.isAuthenticated);
  const user = useSelector((state: RootState) => state.registration.user) as User | null;
  const cartId = useSelector((state: RootState) => state.cart.cartId);
  const loading = useSelector((state: RootState) => state.cart.loading);
  
  const [subTotal, setSubTotal] = useState(0);
  const [vat, setVat] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  
  // Thêm tham chiếu cho interval refresh sử dụng number thay vì NodeJS.Timeout
  const refreshIntervalRef = useRef<number | null>(null);

  // Lấy giỏ hàng từ API khi người dùng đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && user?._id && isCartOpen) {
      dispatch(fetchCartFromAPI(user._id));
      
      // Thiết lập interval để làm mới giỏ hàng mỗi 10 giây khi sidebar mở
      refreshIntervalRef.current = window.setInterval(() => {
        dispatch(fetchCartFromAPI(user._id));
      }, 10000);
    }
    
    // Clear interval khi component unmount hoặc khi sidebar đóng
    return () => {
      if (refreshIntervalRef.current) {
        window.clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [isAuthenticated, user, isCartOpen, dispatch]);

  useEffect(() => {
    if (cartItems.length === 0) {
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
  }, [cartItems]);
  const total = subTotal + vat;

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const handleRemoveFromCart = (item: CartItem) => {
    // Xác nhận trước khi xóa
    const isConfirmed = window.confirm(`Bạn có chắc muốn xóa sản phẩm "${item.name}" khỏi giỏ hàng?`);
    
    if (!isConfirmed) {
      return;
    }
    
    console.log('Xóa sản phẩm với cartItemId:', item._id);
    
    if (isAuthenticated) {
      dispatch(removeCartItemAsync(item._id))
        .unwrap()
        .then(() => {
          showSuccessToast("Xóa sản phẩm khỏi giỏ hàng thành công!");
        })
        .catch((error: any) => {
          showSuccessToast(error || "Có lỗi xảy ra khi xóa sản phẩm", {
            icon: false,
            type: "error"
          });
        });
    } else {
      dispatch(removeItem(item._id));
    }
  };

  return (
    <>
      {isCartOpen && (
        <div
          style={{ display: isCartOpen ? "block" : "none" }}
          className="gi-side-cart-overlay"
          onClick={closeCart}
        ></div>
      )}
      <div
        id="gi-side-cart"
        className={`gi-side-cart ${isCartOpen ? "gi-open-cart" : ""}`}
      >
        <div className="gi-cart-inner">
          <div className="gi-cart-top">
            <div className="gi-cart-title">
              <span className="cart_title">Giỏ hàng của tôi</span>
              <Link onClick={closeCart} href="/" className="gi-cart-close">
                <i onClick={handleSubmit} className="fi-rr-cross-small"></i>
              </Link>
            </div>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center py-4">
                <Spinner />
              </div>
            ) : !isAuthenticated ? (
              <div className="gi-pro-content cart-pro-title py-3">
                Vui lòng đăng nhập để xem giỏ hàng của bạn.
              </div>
            ) : cartItems.length === 0 ? (
              <div className="gi-pro-content cart-pro-title">
                Giỏ hàng của bạn đang trống.
              </div>
            ) : (
              <ul className="gi-cart-pro-items">
                {cartItems.map((item: CartItem, index: number) => (
                  <li key={index}>
                    <Link
                      onClick={handleSubmit}
                      href={`/product/${item.productId}`}
                      className="gi-pro-img"
                    >
                      <img src={item.image_url} alt={item.name} />
                    </Link>
                    <div className="gi-pro-content">
                      <Link href={`/product/${item.productId}`} className="cart-pro-title">
                        {item.name}
                      </Link>
                      <span className="cart-price">
                        <span>
                          {new Intl.NumberFormat('vi-VN', { 
                            style: 'currency', 
                            currency: 'VND' 
                          }).format(item.price * item.quantity)}
                        </span>
                      </span>
                      <div className="qty-plus-minus gi-qty-rtl">
                        <QuantitySelector
                          id={item._id}
                          quantity={item.quantity}
                        />
                      </div>
                      <Link
                        onClick={() => handleRemoveFromCart(item)}
                        href="#/"
                        className="remove"
                      >
                        ×
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {!loading && isAuthenticated && cartItems.length > 0 && (
            <div className="gi-cart-bottom">
              <div className="cart-sub-total">
                <table className="table cart-table">
                  <tbody>
                    <tr>
                      <td className="text-left">Tạm tính:</td>
                      <td className="text-right">
                        {new Intl.NumberFormat('vi-VN', { 
                          style: 'currency', 
                          currency: 'VND' 
                        }).format(subTotal)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left">VAT (10%):</td>
                      <td className="text-right">
                        {new Intl.NumberFormat('vi-VN', { 
                          style: 'currency', 
                          currency: 'VND' 
                        }).format(vat)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left">Tổng cộng:</td>
                      <td className="text-right primary-color">
                        {new Intl.NumberFormat('vi-VN', { 
                          style: 'currency', 
                          currency: 'VND' 
                        }).format(total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="cart_btn">
                <Link 
                  href="/cart" 
                  className="gi-btn-1" 
                  onClick={closeCart}
                  style={{ 
                    display: 'block', 
                    margin: '0 auto', 
                    textAlign: 'center', 
                    width: '100%',
                    maxWidth: '200px' 
                  }}
                >
                  Xem giỏ hàng
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SidebarCart;
