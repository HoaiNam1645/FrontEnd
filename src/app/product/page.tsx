"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash, FaPlus, FaSortUp, FaSortDown } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./product.css";
import axios from "axios";
import { useSearchParams } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  image_url: string;
}

interface Category {
  _id: string;
  name: string;
}

const listProducts = async () => {
  try {
    const response = await axios.get("http://localhost:5001/api/products/getAll");
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    toast.error("Có lỗi xảy ra khi lấy danh sách sản phẩm");
  }
}

const listCategories = async () => {
  try {
    const response = await axios.get("http://localhost:5001/api/categories/getAll");
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    toast.error("Có lỗi xảy ra khi lấy danh sách danh mục");
  }
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          listProducts(),
          listCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error("Có lỗi xảy ra khi lấy dữ liệu");
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (_id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      try {
        await axios.delete(`http://localhost:5001/api/products/delete/${_id}`);
        setProducts(products.filter(product => product._id !== _id));
        toast.success('Xóa sản phẩm thành công!');
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        toast.error('Có lỗi xảy ra khi xóa sản phẩm!');
      }
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Chưa phân loại';
  };

  // Lọc sản phẩm theo danh mục và tìm kiếm
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryId || product.categoryId === categoryId;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ marginTop: '60px' }}
      />
      <div className="product-list-container">
        <div className="page-header">
          <h1>Quản Lý Sản Phẩm</h1>
          <Link href="/product/create" className="btn btn-primary">
            <FaPlus /> Thêm Sản Phẩm
          </Link>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="search-sort-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <i className="fas fa-search search-icon"></i>
              </div>
              <button 
                className="btn btn-icon btn-secondary sort-btn"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                title="Sắp xếp theo tên"
              >
                {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tên Sản Phẩm</th>
                    <th>Hình Ảnh</th>
                    <th>Giá</th>
                    <th>Tồn Kho</th>
                    <th>Danh Mục</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>
                        <img src={product.image_url} alt={product.name} style={{ width: '50px', height: '50px' }} />
                      </td>
                      <td>{product.price.toLocaleString('vi-VN')}đ</td>
                      <td>{product.stock}</td>
                      <td>{getCategoryName(product.categoryId)}</td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            href={`/product/edit/${product._id}`}
                            className="btn btn-icon btn-warning"
                            title="Chỉnh sửa"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="btn btn-icon btn-danger"
                            title="Xóa"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductList; 