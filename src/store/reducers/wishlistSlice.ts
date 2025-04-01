import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/services/productService";

interface WishlistState {
  wishlist: Product[];
}

const initialState: WishlistState = {
  wishlist: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addWishlist: (state, action: PayloadAction<Product>) => {
      if (!state.wishlist.some(item => item._id === action.payload._id)) {
        state.wishlist.push(action.payload);
      }
    },
    removeWishlist: (state, action: PayloadAction<string>) => {
      state.wishlist = state.wishlist.filter(
        (item) => item._id !== action.payload
      );
    },
    clearWishlist: (state) => {
      state.wishlist = [];
    },
  },
});

export const { addWishlist, removeWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
