import { useDispatch, useSelector } from "react-redux";
import { updateItemQuantity } from "../../store/reducers/cartSlice";
import { RootState } from "../../store";
import { useState, useEffect } from "react";
import { productService } from "../../services/productService";
import { toast } from "react-toastify";

const showWarningToast = (message: string) => {
  toast.warning(message);
};

const QuantitySelector = ({
  id,
  quantity,
  setQuantity,
  productId,
}: {
  id: string;
  quantity: number;
  setQuantity?: any;
  productId?: string;
}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [maxStock, setMaxStock] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch product stock when component mounts
  useEffect(() => {
    const fetchProductStock = async () => {
      if (!productId) {
        // Try to get productId from cartItems if not directly provided
        const item = cartItems.find(item => item._id === id);
        if (!item?.productId) return;
        
        try {
          setIsLoading(true);
          const product = await productService.getProductById(item.productId);
          if (product && typeof product.stock === 'number') {
            setMaxStock(product.stock);
          }
        } catch (error) {
          console.error('Error fetching product stock:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        try {
          setIsLoading(true);
          const product = await productService.getProductById(productId);
          if (product && typeof product.stock === 'number') {
            setMaxStock(product.stock);
          }
        } catch (error) {
          console.error('Error fetching product stock:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProductStock();
  }, [id, productId, cartItems]);

  const handleQuantityChange = (operation: "increase" | "decrease") => {
    let newQuantity = quantity;

    if (operation === "increase") {
      // Check stock limit before increasing
      if (maxStock !== null && quantity >= maxStock) {
        return;
      }
      newQuantity = quantity + 1;
    } else if (operation === "decrease" && quantity > 1) {
      newQuantity = quantity - 1;
    }

    if (undefined !== setQuantity) {
      setQuantity(newQuantity);
    } else {
      const updatedCartItems = cartItems.map(item => 
        item._id === id 
          ? { ...item, quantity: newQuantity } 
          : item
      );
      dispatch(updateItemQuantity(updatedCartItems));
    }
  };

  return (
    <>
      <div
        style={{ margin: " 0 0 0 10px", cursor: "pointer" }}
        onClick={() => handleQuantityChange("decrease")}
      >
        -
      </div>
      <input
        readOnly
        className="qty-input"
        type="text"
        name="gi-qtybtn"
        value={quantity}
      />
      <div
        style={{ margin: " 0 10px 0 0", cursor: "pointer" }}
        onClick={() => handleQuantityChange("increase")}
        className={isLoading || (maxStock !== null && quantity >= maxStock) ? "disabled" : ""}
      >
        +
      </div>
      {maxStock !== null && quantity >= maxStock && (
        <span style={{ 
          fontSize: '11px', 
          color: '#e74c3c', 
          position: 'absolute', 
          bottom: '-18px', 
          left: '0', 
          whiteSpace: 'nowrap' 
        }}>
          Đạt giới hạn kho
        </span>
      )}
    </>
  );
};

export default QuantitySelector;
