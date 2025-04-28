"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../user.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormErrors {
  [key: string]: string;
}

export default function CreateUser() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: "user",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "fullName":
        if (!value.trim()) {
          error = "Vui lòng nhập họ và tên";
        } else if (value.trim().length < 2) {
          error = "Họ tên phải có ít nhất 2 ký tự";
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = "Vui lòng nhập email";
        } else if (!emailRegex.test(value)) {
          error = "Email không hợp lệ";
        }
        break;

      case "phone":
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!value.trim()) {
          error = "Vui lòng nhập số điện thoại";
        } else if (!phoneRegex.test(value)) {
          error = "Số điện thoại không hợp lệ";
        }
        break;

      case "address":
        if (!value.trim()) {
          error = "Vui lòng nhập địa chỉ";
        }
        break;

      case "password":
        if (!value) {
          error = "Vui lòng nhập mật khẩu";
        } else if (value.length < 6) {
          error = "Mật khẩu phải có ít nhất 6 ký tự";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Vui lòng xác nhận mật khẩu";
        } else if (value !== formData.password) {
          error = "Mật khẩu xác nhận không khớp";
        }
        break;
    }
    return error;
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData; 
      const response = await axios.post('http://localhost:5001/api/users/create', submitData);
      
      if (response.status === 201) {
        toast.success("Tạo người dùng thành công!");
        router.push("/user");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Validate lại confirmPassword khi password thay đổi
    if (name === "password" && formData.confirmPassword) {
      const confirmError = validateField("confirmPassword", formData.confirmPassword);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError,
      }));
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
      <div className="user-form">
        <div className="page-header">
          <h1>Thêm Người Dùng Mới</h1>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">
                  Họ và tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                />
                {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ email"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Số điện thoại <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="address">
                  Địa chỉ <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ"
                />
                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Mật khẩu <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">
                  Xác nhận mật khẩu <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="role">
                  Vai trò <span className="required">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">Người dùng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              <div className="form-actions">
                <Link href="/user" className="btn btn-secondary">
                  Hủy
                </Link>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    'Tạo người dùng'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
} 