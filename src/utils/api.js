import axios from 'axios';

// API base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để xử lý token nếu cần
apiClient.interceptors.request.use(
  (config) => {
    // Lấy thông tin người dùng từ localStorage
    const userData = localStorage.getItem('login_user');
    const user = userData ? JSON.parse(userData) : null;
    
    // Nếu có token trong localStorage, thêm vào header
    const token = localStorage.getItem('login_token') || user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions
export const reviewsApi = {
  createReview: (reviewData) => apiClient.post('/api/reviews/create', reviewData),
};

export const productsApi = {
  getProductById: (productId) => apiClient.get(`/api/products/get/${productId}`),
};

export default apiClient; 