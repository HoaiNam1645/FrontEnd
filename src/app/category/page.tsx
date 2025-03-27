"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./category.css";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
  image_url: string;
}

const listCategories = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/categories/getAll");
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    toast.error("Có lỗi xảy ra khi lấy danh sách danh mục");
  }
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await listCategories();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  const handleDelete = async (_id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/delete/${_id}`);
        setCategories(categories.filter(category => category._id !== _id));
        toast.success('Xóa danh mục thành công!');
      } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
        toast.error('Có lỗi xảy ra khi xóa danh mục!');
      }
    }
  };

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
    <div className="category-list-container">
      <div className="page-header">
        <h1>Quản Lý Danh Mục</h1>
        <Link href="/category/create" className="btn btn-primary">
          <FaPlus /> Thêm Danh Mục
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tên Danh Mục</th>
                  <th>Hình Ảnh</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {categories
                  .filter((category) =>
                    category.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((category) => (
                    <tr key={category._id}>
                      <td>{category.name}</td>
                      <td>
                        <img src={category.image_url} alt={category.name} style={{ width: '50px', height: '50px' }} />
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            href={`/category/edit/${category._id}`}
                            className="btn btn-icon btn-warning"
                            title="Chỉnh sửa"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(category._id)}
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