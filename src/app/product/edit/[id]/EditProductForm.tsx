"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../product.css";
import axios from "axios";

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

interface EditProductFormProps {
  id: string;
}

export default function EditProductForm({ id }: EditProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Product>({
    _id: "",
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
    image_url: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/products/get/${id}`),
          axios.get("http://localhost:5000/api/categories/getAll")
        ]);
        
        const productData = productResponse.data.data;
        setFormData(productData);
        setImagePreview(productData.image_url);
        setCategories(categoriesResponse.data.data);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi lấy thông tin";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("stock", formData.stock.toString());
      formDataToSend.append("categoryId", formData.categoryId);
      
      if (image) {
        formDataToSend.append("image", image);
      }

      await axios.post(`http://localhost:5000/api/products/update/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Cập nhật sản phẩm thành công!");
      router.push("/product");
      router.refresh();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật sản phẩm";
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
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

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
          <h1>Chỉnh Sửa Sản Phẩm</h1>
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
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="form-control"
                  accept="image/*"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: "200px", maxHeight: "200px" }} />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Cập Nhật Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
} 