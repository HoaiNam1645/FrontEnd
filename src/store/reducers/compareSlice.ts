import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/services/productService";

interface CompareState {
  compare: Product[];
}

const initialState: CompareState = {
  compare: [],
};

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    addCompare: (state, action: PayloadAction<Product>) => {
      if (!state.compare.some(item => item._id === action.payload._id)) {
        state.compare.push(action.payload);
      }
    },
    removeCompareItem: (state, action: PayloadAction<string>) => {
      state.compare = state.compare.filter(
        (item) => item._id !== action.payload
      );
    },
    clearCompare: (state) => {
      state.compare = [];
    },
  },
});

export const { addCompare, removeCompareItem, clearCompare } = compareSlice.actions;

export default compareSlice.reducer;
