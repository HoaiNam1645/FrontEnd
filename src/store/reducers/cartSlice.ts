import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/services/productService";
import { cartService, CartRequest, CartItem, CreateOrderRequest } from "@/services/cartService";
import { showSuccessToast } from "@/components/toast-popup/Toastify";

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  cartId: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  cartId: null
};

// Thunk action mới để lấy giỏ hàng từ API mới
export const fetchCartFromAPI = createAsyncThunk(
  'cart/fetchCartFromAPI',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await cartService.getCartFromAPI(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk action để thêm sản phẩm vào giỏ hàng qua API
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (cartData: CartRequest, { rejectWithValue }) => {
    try {
      const response = await cartService.addToCart(cartData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk action để lấy giỏ hàng của người dùng
export const fetchUserCartAsync = createAsyncThunk(
  'cart/fetchUserCartAsync',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await cartService.getUserCart(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk action để xóa sản phẩm khỏi giỏ hàng
export const removeCartItemAsync = createAsyncThunk(
  'cart/removeCartItemAsync',
  async (cartItemId: string, { rejectWithValue }) => {
    try {
      const response = await cartService.removeCartItem(cartItemId);
      showSuccessToast("Đã xóa sản phẩm khỏi giỏ hàng");
      return { response, cartItemId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk action để cập nhật số lượng sản phẩm
export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItemAsync',
  async ({ cartId, productId, quantity }: { cartId: string, productId: string, quantity: number }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateCartItem(cartId, productId, quantity);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk action để tạo đơn hàng mới
export const createOrderAsync = createAsyncThunk(
  'cart/createOrderAsync',
  async (orderData: CreateOrderRequest, { rejectWithValue }) => {
    try {
      const response = await cartService.createOrder(orderData);
      showSuccessToast("Đặt hàng thành công!");
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    updateItemQuantity: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.cartId = null;
    },
    setCartDetails: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Thêm xử lý cho fetchCartFromAPI
    builder.addCase(fetchCartFromAPI.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCartFromAPI.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload && action.payload.success) {
        // API trả về dữ liệu trong action.payload.data
        state.items = action.payload.data || [];
        
        // Cập nhật cartId (sử dụng userId cho phù hợp)
        if (action.payload.data && action.payload.data.length > 0) {
          state.cartId = action.payload.data[0].userId;
        }
      }
    });
    builder.addCase(fetchCartFromAPI.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Xử lý addToCartAsync
    builder.addCase(addToCartAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addToCartAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.cartId = action.payload._id;
      // Không cập nhật state.items vì API không trả về thông tin sản phẩm đầy đủ
      // Sẽ cần gọi fetchUserCartAsync sau đó để cập nhật
    });
    builder.addCase(addToCartAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Xử lý fetchUserCartAsync
    builder.addCase(fetchUserCartAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserCartAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.cartId = action.payload._id;
      // Cập nhật state.items từ dữ liệu API
      // Cần chuyển đổi dữ liệu từ API sang định dạng CartItem
      // Phần này sẽ cần bổ sung logicchuyển đổi khi có dữ liệu thực tế từ API
    });
    builder.addCase(fetchUserCartAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Xử lý removeCartItemAsync
    builder.addCase(removeCartItemAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeCartItemAsync.fulfilled, (state, action) => {
      state.loading = false;
      // Xóa sản phẩm khỏi state.items bằng cartItemId
      if (action.payload && action.payload.cartItemId) {
        state.items = state.items.filter(item => item._id !== action.payload.cartItemId);
      }
    });
    builder.addCase(removeCartItemAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Xử lý updateCartItemAsync
    builder.addCase(updateCartItemAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCartItemAsync.fulfilled, (state, action) => {
      state.loading = false;
      // Cập nhật state.items từ dữ liệu API (cần bổ sung logic)
    });
    builder.addCase(updateCartItemAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Xử lý createOrderAsync
    builder.addCase(createOrderAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createOrderAsync.fulfilled, (state, action) => {
      state.loading = false;
      // Xóa giỏ hàng sau khi đặt hàng thành công
      state.items = [];
      state.cartId = null;
    });
    builder.addCase(createOrderAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export const {
  setItems,
  addItem,
  removeItem,
  updateItemQuantity,
  clearCart,
  setCartDetails
} = cartSlice.actions;

export default cartSlice.reducer;
