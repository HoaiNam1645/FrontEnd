import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';

export interface CartRequest {
  userId: string;
  productId: string;
  quantity: number;
}

export interface CartResponse {
  _id: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  userId: string;
  productId: string;
  quantity: number;
  image_url: string;
  name: string;
  price: number;
}

export interface CartDetailResponse {
  code: number;
  success: boolean;
  data: CartItem[];
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
  name: string;
  price: number;
}

export interface CreateOrderRequest {
  userId: string;
  totalAmount: number;
  status: string;
  address: string;
  phoneNumber: string;
  recipientName: string;
  orderItemList: OrderItemRequest[];
}

export interface OrderDetail {
  _id: string;
  userId: string;
  totalAmount: number;
  address: string;
  phoneNumber: string;
  status: string;
  recipientName: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  code: number;
  success: boolean;
  data: OrderDetail[];
}

export interface OrderItem {
  _id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  description: string;
  image_url: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderWithItems {
  order: OrderDetail;
  orderItemList: OrderItem[];
}

export interface RemoveCartItemResponse {
  code: number;
  success: boolean;
  data: {
    _id: string;
    userId: string;
    productId: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  }[];
}

export const cartService = {
  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (cartData: CartRequest): Promise<CartResponse> => {
    try {
      const token = localStorage.getItem('login_token');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
      }

      const response = await axios.post(`${API_URL}/carts/create`, cartData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Thêm vào giỏ hàng thành công:', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      throw error;
    }
  },

  // Lấy giỏ hàng của người dùng
  getUserCart: async (userId: string): Promise<CartResponse> => {
    try {
      const token = localStorage.getItem('login_token');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để xem giỏ hàng');
      }

      const response = await axios.get(`${API_URL}/carts/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
      throw error;
    }
  },
  
  // Lấy giỏ hàng từ API mới
  getCartFromAPI: async (userId: string): Promise<CartDetailResponse> => {
    try {
      console.log('Đang lấy giỏ hàng cho người dùng:', userId);
      const token = localStorage.getItem('login_token');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để xem giỏ hàng');
      }

      const response = await axios.get(`${API_URL}/carts/getAll/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        console.log('Lấy giỏ hàng thành công:', response.data);
        return response.data;
      } else {
        console.error('Lỗi khi lấy giỏ hàng:', response.data);
        throw new Error('Không thể lấy giỏ hàng');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API giỏ hàng:', error);
      throw error;
    }
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItem: async (cartId: string, productId: string, quantity: number): Promise<CartResponse> => {
    try {
      const token = localStorage.getItem('login_token');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để cập nhật giỏ hàng');
      }

      const response = await axios.put(`${API_URL}/carts/${cartId}/item`, 
        { productId, quantity },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật giỏ hàng:', error);
      throw error;
    }
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeCartItem: async (cartItemId: string): Promise<RemoveCartItemResponse> => {
    try {
      const token = localStorage.getItem('login_token');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để xóa sản phẩm khỏi giỏ hàng');
      }

      console.log('Đang xóa mục giỏ hàng ID:', cartItemId);
      const response = await axios.delete(`${API_URL}/carts/delete/${cartItemId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Xóa sản phẩm khỏi giỏ hàng thành công:', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
      throw error;
    }
  },

  // Tạo đơn hàng mới
  createOrder: async (orderData: CreateOrderRequest): Promise<any> => {
    try {
      const token = localStorage.getItem('login_token');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để tạo đơn hàng');
      }

      console.log('Đang tạo đơn hàng:', orderData);
      const response = await axios.post(`${API_URL}/orders/create`, orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Tạo đơn hàng thành công:', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error);
      throw error;
    }
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId: string): Promise<any> => {
    try {
      const token = localStorage.getItem('login_token');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để hủy đơn hàng');
      }

      console.log('Đang hủy đơn hàng ID:', orderId);
      const response = await axios.delete(`${API_URL}/orders/delete/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Hủy đơn hàng thành công:', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
      throw error;
    }
  },

  // Lấy danh sách đơn hàng của người dùng
  getUserOrders: async (userId: string): Promise<OrderDetail[]> => {
    try {
      const token = localStorage.getItem('login_token');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để xem đơn hàng');
      }

      console.log('Đang lấy đơn hàng cho người dùng ID:', userId);
      const response = await axios.get<OrdersResponse>(`${API_URL}/orders/getAllByUser/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        console.log('Lấy đơn hàng thành công:', response.data.data);
        return response.data.data;
      } else {
        console.error('Lỗi khi lấy đơn hàng:', response.data);
        throw new Error('Không thể lấy đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API đơn hàng:', error);
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng theo ID
  getOrderDetail: async (orderId: string): Promise<OrderWithItems> => {
    try {
      const token = localStorage.getItem('login_token');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để xem chi tiết đơn hàng');
      }

      console.log('Đang lấy chi tiết đơn hàng ID:', orderId);
      const response = await axios.get(`${API_URL}/orders/get/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        console.log('Lấy chi tiết đơn hàng thành công:', response.data.data);
        return response.data.data;
      } else {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', response.data);
        throw new Error('Không thể lấy chi tiết đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API chi tiết đơn hàng:', error);
      throw error;
    }
  },
}; 