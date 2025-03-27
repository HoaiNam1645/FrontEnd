"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../category.css";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
  image_url: string;
}

interface EditCategoryFormProps {
  id: string;
}

export default function EditCategoryForm({ id }: EditCategoryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Category>({
    _id: "",
    name: "",
    image_url: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/categories/get/${id}`);
        setFormData(response.data.data);
        setPreviewImage(response.data.data.image_url);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi lấy thông tin danh mục";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      if (image) {
        formDataToSend.append("image", image);
      }

        await axios.post(`http://localhost:5000/api/categories/update/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Cập nhật danh mục thành công!");
      router.push("/category");
      router.refresh();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật danh mục";
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
        setPreviewImage(reader.result as string);
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
    <div className="category-form-container">
      <div className="page-header">
        <Link href="/category" className="btn btn-secondary">
          <FaArrowLeft /> Quay lại
        </Link>
        <h1>Chỉnh Sửa Danh Mục</h1>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="form">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">Tên Danh Mục</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
                placeholder="Nhập tên danh mục"
              />
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
              {previewImage && (
                <div className="mt-2">
                  <img src={previewImage} alt="Preview" style={{ maxWidth: "200px", maxHeight: "200px" }} />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Cập Nhật Danh Mục
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
} 