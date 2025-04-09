import { useDispatch, useSelector } from "react-redux";
import { updateItemQuantity } from "../../store/reducers/cartSlice";
import { RootState } from "../../store";

const QuantitySelector = ({
  id,
  quantity,
  setQuantity,
}: {
  id: string;
  quantity: number;
  setQuantity?: any;
}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleQuantityChange = (operation: "increase" | "decrease") => {
    let newQuantity = quantity;

    if (operation === "increase") {
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
      >
        +
      </div>
    </>
  );
};

export default QuantitySelector;
