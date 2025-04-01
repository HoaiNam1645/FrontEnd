import { useEffect, useState } from "react";
import StarRating from "../stars/StarRating";
import QuickViewModal from "../model/QuickViewModal";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  setItems,
  updateItemQuantity,
} from "../../store/reducers/cartSlice";
import Link from "next/link";
import { showSuccessToast } from "../toast-popup/Toastify";
import { RootState } from "@/store";
import { addWishlist, removeWishlist } from "@/store/reducers/wishlistSlice";
import { addCompare, removeCompareItem } from "@/store/reducers/compareSlice";
import { Product } from "@/services/productService";

interface ItemCardProps {
  data: Product;
}

const ItemCard = ({ data }: ItemCardProps) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const compareItems = useSelector((state: RootState) => state.compare.compare);
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.wishlist
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);

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
    const isItemInCart = cartItems.some((item) => item._id === data._id);

    if (!isItemInCart) {
      dispatch(addItem({ ...data, quantity: 1 }));
      showSuccessToast("Thêm sản phẩm vào giỏ hàng thành công!");
    } else {
      const updatedCartItems = cartItems.map((item) =>
        item._id === data._id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      );
      dispatch(updateItemQuantity(updatedCartItems));
      showSuccessToast("Thêm sản phẩm vào giỏ hàng thành công!");
    }
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
        <div className={` gi-product-inner`}>
          <div className="gi-pro-image-outer">
            <div className="gi-pro-image" style={{ 
              width: '100%',
              height: '400px',
              overflow: 'hidden'
            }}>
              <Link onClick={handleSubmit} href="/" className="image">
                <span className="label veg">
                  <span className="dot"></span>
                </span>
                <img 
                  className="main-image" 
                  src={data.image_url} 
                  alt={data.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <img
                  className="hover-image"
                  src={data.image_url}
                  alt={data.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
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
              <Link href="/product-left-sidebar">{data.name}</Link>
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
                <StarRating rating={5} />
                <span className="qty">Còn lại: {data.stock}</span>
              </span>
              <span className="gi-price">
                <span className="new-price">{data.price.toLocaleString('vi-VN')}đ</span>
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
