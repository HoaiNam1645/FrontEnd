import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
  removeCartItem: async (cartId: string, productId: string): Promise<CartResponse> => {
    try {
      const token = localStorage.getItem('login_token');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để xóa sản phẩm khỏi giỏ hàng');
      }

      const response = await axios.delete(`${API_URL}/carts/${cartId}/item/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
      throw error;
    }
  }
}; 