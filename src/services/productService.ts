import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  image_url: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  ratingAverage?: number;
  ratingCount?: number;
}

// Dữ liệu mẫu khi API không hoạt động
const sampleProducts: Product[] = [
  {
    _id: '1',
    name: 'Laptop Gaming MSI',
    description: 'Laptop gaming mạnh mẽ với hiệu năng cao',
    price: 19990000,
    stock: 15,
    categoryId: '1',
    image_url: '/assets/img/product-images/1_1.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Điện thoại Samsung S23',
    description: 'Điện thoại cao cấp với camera chất lượng',
    price: 15990000,
    stock: 25,
    categoryId: '2',
    image_url: '/assets/img/product-images/2_1.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Máy tính bảng iPad Pro',
    description: 'Màn hình Retina sắc nét, hiệu năng mạnh mẽ',
    price: 14990000,
    stock: 10,
    categoryId: '1',
    image_url: '/assets/img/product-images/3_1.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '4',
    name: 'Tai nghe Sony WH-1000XM4',
    description: 'Chống ồn chủ động, âm thanh Hi-Res',
    price: 5990000,
    stock: 30,
    categoryId: '3',
    image_url: '/assets/img/product-images/6_1.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '5',
    name: 'Camera Mirrorless Sony Alpha',
    description: 'Camera không gương lật chuyên nghiệp',
    price: 25990000,
    stock: 8,
    categoryId: '2',
    image_url: '/assets/img/product-images/9_1.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '6',
    name: 'Đồng hồ thông minh Apple Watch',
    description: 'Theo dõi sức khỏe, nhận thông báo',
    price: 8990000,
    stock: 20,
    categoryId: '4',
    image_url: '/assets/img/product-images/32_1.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '7',
    name: 'Máy ảnh DSLR Canon',
    description: 'Chụp ảnh chuyên nghiệp với cảm biến full-frame',
    price: 32990000,
    stock: 5,
    categoryId: '2',
    image_url: '/assets/img/product-images/33_1.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '8',
    name: 'Máy chơi game PlayStation 5',
    description: 'Trải nghiệm gaming đỉnh cao',
    price: 11990000,
    stock: 12,
    categoryId: '5',
    image_url: '/assets/img/product-images/34_1.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Kiểm tra xem API có hoạt động hay không thông qua gọi trực tiếp
const testApiConnection = async () => {
  try {
    console.log(`Đang kiểm tra kết nối tới API: ${API_URL}/products/getAll`);
    const response = await axios.get(`${API_URL}/products/getAll`);
    console.log('API trả về status:', response.status);
    console.log('API trả về headers:', response.headers);
    console.log('API response data chi tiết:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.data) {
      console.log(`Số lượng sản phẩm nhận được: ${response.data.data.length}`);
      if (response.data.data.length > 0) {
        console.log('Mẫu sản phẩm đầu tiên:', response.data.data[0]);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Lỗi kết nối API:', error.message);
    if (error.response) {
      // Server trả về response với status code nằm ngoài phạm vi 2xx
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      // Request đã được gửi nhưng không nhận được response
      console.error('No response received:', error.request);
    } else {
      // Có lỗi khi thiết lập request
      console.error('Error setting up request:', error.message);
    }
    return false;
  }
};

export const productService = {
  getAllProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/products/getAll`);
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        const apiProducts = response.data.data;
        
        // Xác nhận dữ liệu trả về có đúng cấu trúc không
        const validProducts = apiProducts.filter(item => 
          item && item._id && item.name && typeof item.price === 'number'
        );
        
        if (validProducts.length > 0) {
          // Xử lý dữ liệu sản phẩm trước khi trả về
          const processedProducts = validProducts.map(product => ({
            ...product,
            // Đảm bảo image_url luôn có giá trị, nếu không có thì dùng ảnh mặc định
            image_url: product.image_url || `/assets/img/product-images/${Math.floor(Math.random() * 30) + 1}_1.jpg`
          }));
          
          return processedProducts;
        }
      }
      
      return sampleProducts;
    } catch (error) {
      console.error('Lỗi khi gọi API:', error.message);
      // Log lỗi chi tiết hơn
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      } else if (error.request) {
        console.error('Không nhận được phản hồi từ server');
      }
      
      console.log('Đang sử dụng dữ liệu mẫu vì API lỗi');
      return sampleProducts;
    }
  },
  
  // Thử kết nối API endpoint khác
  testAlternativeEndpoint: async () => {
    try {
      // Thử các endpoint khác để xem có hoạt động không
      console.log('Đang thử endpoint thay thế');
      const endpoints = [
        '/products',
        '/product/getAll',
        '/product',
        '/product/all'
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await axios.get(`${API_URL}${endpoint}`);
          if (response.data) {
            return {
              success: true,
              endpoint,
              data: response.data
            };
          }
        } catch (e) {
          console.log(`Endpoint ${endpoint} không hoạt động:`, e.message);
        }
      }
      
      return {
        success: false,
        message: 'Không tìm thấy endpoint hoạt động'
      };
    } catch (error) {
      console.error('Lỗi thử các endpoint thay thế:', error);
      return {
        success: false,
        message: error.message
      };
    }
  },
  
  // Phương thức mới để lấy sản phẩm mẫu khi debugging
  getSampleProducts: () => {
    return sampleProducts;
  },
  
  getProductById: async (productId: string) => {
    try {
      const response = await axios.get(`${API_URL}/products/get/${productId}`);
      
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      
      // Nếu không tìm thấy hoặc có lỗi, trả về sản phẩm mẫu có ID tương ứng
      const fallbackProduct = sampleProducts.find(p => p._id === productId);
      if (fallbackProduct) {
        return fallbackProduct;
      }
      
      throw new Error('Không tìm thấy sản phẩm');
    } catch (error) {
      console.error('Lỗi khi lấy thông tin sản phẩm:', error.message);
      // Tìm trong dữ liệu mẫu
      const fallbackProduct = sampleProducts.find(p => p._id === productId);
      if (fallbackProduct) {
        return fallbackProduct;
      }
      throw new Error('Không thể lấy thông tin sản phẩm');
    }
  }
}; 