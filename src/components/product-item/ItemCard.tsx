import { useEffect, useState } from "react";
import StarRating from "../stars/StarRating";
import QuickViewModal from "../model/QuickViewModal";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  setItems,
  updateItemQuantity,
  addToCartAsync,
  fetchCartFromAPI
} from "../../store/reducers/cartSlice";
import Link from "next/link";
import { showSuccessToast } from "../toast-popup/Toastify";
import { RootState, AppDispatch } from "@/store";
import { addWishlist, removeWishlist } from "@/store/reducers/wishlistSlice";
import { addCompare, removeCompareItem } from "@/store/reducers/compareSlice";
import { Product } from "@/services/productService";
import { API_DOMAIN } from "@/components/shop-sidebar/Shop";

interface ItemCardProps {
  data: Product;
}

interface User {
  id: string;
  [key: string]: any;
}

const ItemCard = ({ data }: ItemCardProps) => {
  console.log('ItemCard rendering product:', data);
  
  const [show, setShow] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const compareItems = useSelector((state: RootState) => state.compare.compare);
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.wishlist
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isAuthenticated = useSelector((state: RootState) => state.registration.isAuthenticated);
  const userFromStore = useSelector((state: RootState) => state.registration.user);
  
  // Lấy user từ cả localStorage và Redux store để đảm bảo luôn có dữ liệu
  const userFromLocal = typeof window !== 'undefined' ? 
    JSON.parse(localStorage.getItem('login_user') || '{}') : null;
  
  // Ưu tiên dùng user từ store, nếu không có thì dùng từ localStorage
  const user = userFromStore || userFromLocal;
  
  console.log('user', user);
  
  const cartId = useSelector((state: RootState) => state.cart.cartId);

  // Thêm state để theo dõi lỗi hình ảnh
  const [imgError, setImgError] = useState(false);
  const defaultImg = '/assets/img/product-images/1_1.jpg';

  // Tạo đường dẫn chi tiết sản phẩm
  const getProductDetailUrl = () => {
    return `/product-left-sidebar/${data._id}`;
  };

  // Xử lý đường dẫn hình ảnh
  const getImageUrl = (url: string | undefined) => {
    if (!url) return defaultImg;
    
    // Nếu là đường dẫn đầy đủ, sử dụng trực tiếp
    if (url.startsWith('http')) {
      return url;
    }
    
    // Thêm domain cho đường dẫn tương đối
    if (url.startsWith('/')) {
      return `${API_DOMAIN}${url}`;
    }
    
    // Nếu không có / ở đầu, thêm vào
    return `${API_DOMAIN}/${url}`;
  };

  useEffect(() => {
    const keys = data ? Object.keys(data) : [];
    console.log(`Sản phẩm có các trường: ${keys.join(', ')}`);
    console.log(`id: ${data?._id}, name: ${data?.name}, price: ${data?.price}`);
    console.log(`image_url: ${data?.image_url}`);
    
    if (data?.image_url) {
      // Kiểm tra đường dẫn hình ảnh
      if (data.image_url.startsWith('http')) {
        console.log('Đường dẫn hình ảnh là URL đầy đủ:', data.image_url);
      } else if (data.image_url.startsWith('/')) {
        console.log('Đường dẫn hình ảnh là đường dẫn tương đối từ gốc:', data.image_url);
      } else {
        console.log('Đường dẫn hình ảnh có thể không đúng định dạng:', data.image_url);
      }
    } else {
      console.log('Sản phẩm không có đường dẫn hình ảnh');
    }
  }, [data]);

  useEffect(() => {
    const itemsFromLocalStorage =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("products") || "[]")
        : [];
    if (itemsFromLocalStorage.length) {
      dispatch(setItems(itemsFromLocalStorage));
    }
  }, [dispatch]);

  const handleCart = (data: Product) => {
    if (!isAuthenticated) {
      showSuccessToast("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", {
        icon: false,
        type: "error"
      });
      return;
    }

    // Kiểm tra user ID
    const userId = user?.id || user?._id;
    if (!userId) {
      showSuccessToast("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!", {
        icon: false,
        type: "error"
      });
      return;
    }

    // Luôn sử dụng API để thêm/cập nhật giỏ hàng
    dispatch(addToCartAsync({
      userId: userId,
      productId: data._id,
      quantity: 1
    }))
    .unwrap()
    .then(() => {
      // Sau khi API thành công, cập nhật lại toàn bộ giỏ hàng từ server
      dispatch(fetchCartFromAPI(userId));
      showSuccessToast("Thêm sản phẩm vào giỏ hàng thành công!");
    })
    .catch((error) => {
      showSuccessToast(error.message || "Có lỗi xảy ra khi thêm vào giỏ hàng", {
        icon: false,
        type: "error"
      });
    });
  };

  const isInWishlist = (data: Product) => {
      return wishlistItems.some((item) => item._id === data._id);
  };

  const handleWishlist = (data: Product) => {
    if (!isInWishlist(data)) {
      dispatch(addWishlist(data));
      showSuccessToast("Thêm sản phẩm vào danh sách yêu thích thành công!", {
        icon: false,
      });
    } else {
      dispatch(removeWishlist(data._id));
      showSuccessToast("Xóa sản phẩm khỏi danh sách yêu thích thành công!", {
        icon: false,
      });
    }
  };

  const isInCompare = (data: Product) => {
    return compareItems.some((item: Product) => item._id === data._id);
  };

  const handleCompareItem = (data: Product) => {
    if (!isInCompare(data)) {
      dispatch(addCompare(data));
      showSuccessToast("Thêm sản phẩm vào danh sách so sánh thành công!", {
        icon: false,
      });
    } else {
      dispatch(removeCompareItem(data._id));
      showSuccessToast("Xóa sản phẩm khỏi danh sách so sánh thành công!", {
        icon: false,
      });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="gi-product-content">
        <div className={`gi-product-inner`} style={{ margin: '0 auto', maxWidth: '100%' }}>
          <div className="gi-pro-image-outer">
            <div className="gi-pro-image" style={{ 
              width: '100%',
              height: '400px',
              overflow: 'hidden',
              backgroundColor: '#f8f8f8'
            }}>
              <Link onClick={handleSubmit} href={getProductDetailUrl()} className="image">
                <span className="label veg">
                  <span className="dot"></span>
                </span>
                <img 
                  className="main-image" 
                  src={imgError ? defaultImg : getImageUrl(data.image_url)} 
                  alt={data.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    console.log('Lỗi tải hình ảnh, đang sử dụng ảnh dự phòng:', data.image_url);
                    setImgError(true);
                  }}
                />
                <img
                  className="hover-image"
                  src={imgError ? defaultImg : getImageUrl(data.image_url)}
                  alt={data.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    setImgError(true);
                  }}
                />
              </Link>
              <span className="flags">
                {data.stock < 10 && (
                  <span className="sale">Sắp hết hàng</span>
                )}
              </span>
              <div className="gi-pro-actions">
                <button
                  onClick={() => handleWishlist(data)}
                  className={
                    "gi-btn-group wishlist " +
                    (isInWishlist(data) ? "active" : "")
                  }
                  title="Yêu thích"
                >
                  <i className="fi-rr-heart"></i>
                </button>
                <button
                  className="gi-btn-group quickview gi-cart-toggle"
                  data-link-action="quickview"
                  title="Xem nhanh"
                  data-bs-toggle="modal"
                  data-bs-target="#gi_quickview_modal"
                  onClick={handleShow}
                >
                  <i className="fi-rr-eye"></i>
                </button>
                <button
                  onClick={() => handleCompareItem(data)}
                  className={
                    "gi-btn-group compare " +
                    (isInCompare(data) ? "active" : "")
                  }
                  title="So sánh"
                >
                  <i className="fi fi-rr-arrows-repeat"></i>
                </button>
                <button
                  title="Thêm vào giỏ hàng"
                  className="gi-btn-group add-to-cart"
                  onClick={() => handleCart(data)}
                >
                  <i className="fi-rr-shopping-basket"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="gi-pro-content">
            <h5 className="gi-pro-title">
              <Link href={getProductDetailUrl()}>{data.name}</Link>
            </h5>
            <div className="description-container" style={{
              position: 'relative',
              marginBottom: '10px'
            }}>
              <p className="gi-info" style={{ 
                fontSize: '14px', 
                color: '#666',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: '1.4',
                margin: 0,
                cursor: 'pointer'
              }}>
                {data.description}
              </p>
              <div className="description-full" style={{
                display: 'none',
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                padding: '10px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                zIndex: 1,
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.4',
                borderRadius: '4px'
              }}>
                {data.description}
              </div>
            </div>
            <style jsx>{`
              .description-container:hover .description-full {
                display: block;
              }
            `}</style>
            <div className="gi-pro-rat-price">
              <span className="gi-pro-rating">
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
                <span className="qty">Còn lại: {data.stock}</span>
              </span>
              <span className="gi-price">
                <span className="new-price">{data?.price ? data.price.toLocaleString('vi-VN') : '0'}đ</span>
              </span>
            </div>
          </div>
        </div>
        <QuickViewModal data={data} handleClose={handleClose} show={show} />
      </div>
    </>
  );
};

export default ItemCard;
