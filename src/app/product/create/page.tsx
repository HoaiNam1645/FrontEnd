"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../product.css";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
}

export default function CreateProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    image: null as File | null,
  });
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/categories/getAll");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách danh mục:", error);
        toast.error("Có lỗi xảy ra khi lấy danh sách danh mục");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("categoryId", formData.categoryId);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      await axios.post("http://localhost:5001/api/products/create", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Tạo sản phẩm thành công!");
      router.push("/product");
      router.refresh();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi tạo sản phẩm";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      <div className="product-form-container">
        <div className="page-header">
          <Link href="/product" className="btn btn-secondary">
            <FaArrowLeft /> Quay lại
          </Link>
          <h1>Thêm Sản Phẩm Mới</h1>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="form">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="name">Tên Sản Phẩm</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Mô Tả</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  rows={4}
                  required
                  placeholder="Nhập mô tả sản phẩm"
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Giá</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-control"
                  required
                  min="0"
                  placeholder="Nhập giá sản phẩm"
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Tồn Kho</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="form-control"
                  required
                  min="0"
                  placeholder="Nhập số lượng tồn kho"
                />
              </div>

              <div className="form-group">
                <label htmlFor="categoryId">Danh Mục</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="image">Hình Ảnh</label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-control"
                    required
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Tạo Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
} 