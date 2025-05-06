import { useDispatch, useSelector } from "react-redux";
import { addItem, updateItemQuantity } from "../../../store/reducers/cartSlice";
import { showSuccessToast } from "@/components/toast-popup/Toastify";
import { RootState } from "@/store";
import { Product } from "@/services/productService";
import Link from "next/link";

const TrendingItem = ({ data }: { data: Product }) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

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

  return (
    <>
      <div className="col-sm-12 gi-all-product-block">
        <div className="gi-all-product-inner">
          <div className="gi-pro-image-outer">
            <div className="gi-pro-image">
              <Link href={`/product-left-sidebar/${data._id}`} className="image">
                <img className="main-image" src={data.image_url} alt={data.name} />
              </Link>
            </div>
          </div>
          <div className="gi-pro-content">
            <h5 className="gi-pro-title">
              <Link href={`/product-left-sidebar/${data._id}`}>{data.name}</Link>
            </h5>
            <h6 className="gi-pro-stitle">
              <Link href={`/category/${data.categoryId}`}>{data.description}</Link>
            </h6>
            <div className="gi-pro-rat-price">
              <div className="gi-pro-rat-pri-inner">
                <span className="gi-price">
                  <span className="new-price">{data.price?.toLocaleString('vi-VN')}đ</span>
                  <span className="qty">- Còn: {data.stock}</span>
                </span>
              </div>
            </div>
            <a
              className="add-to-cart"
              title="Add To Cart"
              onClick={() => handleCart(data)}
            >
              <i className="fi-rr-shopping-basket"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrendingItem;
