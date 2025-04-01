import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
}

export const productService = {
  getAllProducts: async () => {
    const response = await axios.get(`${API_URL}/products/getAll`);
    return response.data.data;
  }
}; 