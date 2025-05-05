"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Form } from "react-bootstrap";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "../toast-popup/Toastify";

export interface UserData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role?: string;
  avatarUrl?: string | null;
  description?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const ProfileEdit = () => {
  const router = useRouter();
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    avatarUrl: null,
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const login = useSelector((state: RootState) => state.registration.isAuthenticated);
  const loginUserData = localStorage.getItem("login_user");
  const idUser = loginUserData ? JSON.parse(loginUserData).id : null;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!idUser) {
          throw new Error("Không tìm thấy ID người dùng");
        }
        const response = await axios.get(`${API_BASE_URL}/api/users/get/${idUser}`);
        const userData = response.data.data;
        
        setFormData({
          fullName: userData.fullName || "",
          email: userData.email || "",
          password: "", // Không hiển thị mật khẩu
          phone: userData.phone || "",
          address: userData.address || "",
          role: userData.role || "user",
          avatarUrl: userData.avatarUrl || null,
          description: userData.description || "",
        });

        // Nếu có avatar, hiển thị ảnh preview
        if (userData.avatarUrl) {
          setImagePreview(userData.avatarUrl);
        }
      } catch (error: any) {
        showErrorToast(error.response?.data?.message || "Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    if (login) {
      fetchUserData();
    }
  }, [login, idUser]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      // Chuẩn bị dữ liệu để gửi lên server
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("role", formData.role || "user");
      
      // Chỉ gửi mật khẩu nếu có nhập
      if (formData.password) {
        formDataToSend.append("password", formData.password);
      }
      
      // Thêm mô tả nếu có
      if (formData.description) {
        formDataToSend.append("description", formData.description);
      }
      
      // Thêm ảnh đại diện nếu có cập nhật mới
      if (avatarFile) {
        // Gửi file thực tế qua FormData để multer xử lý
        formDataToSend.append("avatarUrl", avatarFile); // Tên field phải tương ứng với multer config
      } else if (formData.avatarUrl) {
        // Nếu không có file mới nhưng có URL ảnh cũ, thông báo cho server giữ nguyên
        formDataToSend.append("keepExistingAvatar", "true");
      }

      console.log("Dữ liệu gửi lên:", {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        hasAvatar: !!avatarFile
      });

      // Gửi thông tin cập nhật lên API
      const response = await axios.post(
        `${API_BASE_URL}/api/users/update/${idUser}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Rất quan trọng khi upload file
          },
        }
      );

      if (response.data.success) {
        showSuccessToast("Cập nhật thông tin thành công");
        
        // Cập nhật thông tin người dùng trong localStorage nếu cần
        try {
          const updatedUser = {
            id: idUser,
            fullName: formData.fullName,
            email: formData.email,
            role: formData.role || "user"
          };
          localStorage.setItem("login_user", JSON.stringify(updatedUser));
        } catch (err) {
          console.error("Lỗi khi cập nhật localStorage:", err);
        }
        
        router.push("/user-profile");
      } else {
        showErrorToast(response.data.message || "Cập nhật thông tin thất bại");
      }
    } catch (error: any) {
      showErrorToast(
        error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật thông tin"
      );
    }
  };

  if (!login) {
    return (
      <div className="container padding-tb-40">
        <p>
          Vui lòng <a href="/login">đăng nhập</a> hoặc <a href="/register">đăng ký</a>{" "}
          để xem trang này.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="container padding-tb-40">Đang tải...</div>;
  }

  return (
    <>
      <section className="gi-register padding-tb-40">
        <div className="container">
          <div className="section-title-2">
            <h2 className="gi-title">
              Cập nhật thông tin<span></span>
            </h2>
            <p>Cập nhật thông tin tài khoản của bạn</p>
          </div>
          <div className="row">
            <div className="gi-register-wrapper">
              <div className="gi-register-container">
                <div className="gi-register-form">
                  <Form noValidate validated={validated}
                    className="gi-blog-form"
                    action="#"
                    method="post"
                    onSubmit={handleSubmit}
                  >
                    <span className="gi-register-wrap">
                      <label>Họ và tên*</label>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          name="fullName"
                          placeholder="Nhập họ và tên của bạn"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                        />
                         <Form.Control.Feedback type="invalid">
                          Vui lòng nhập họ và tên.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </span>
                    
                    <span
                      style={{ marginTop: "10px" }}
                      className="gi-register-wrap gi-register-half"
                    >
                      <label>Email*</label>
                      <Form.Group>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Nhập địa chỉ email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          Vui lòng nhập email hợp lệ.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </span>
                    
                    <span
                      style={{ marginTop: "10px" }}
                      className="gi-register-wrap gi-register-half"
                    >
                      <label>Số điện thoại*</label>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          name="phone"
                          placeholder="Nhập số điện thoại"
                          pattern="^\d{10,12}$"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          Vui lòng nhập số điện thoại từ 10-12 số.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </span>
                    
                    <span
                      style={{ marginTop: "10px" }}
                      className="gi-register-wrap"
                    >
                      <label>Địa chỉ*</label>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          name="address"
                          placeholder="Nhập địa chỉ của bạn"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                         <Form.Control.Feedback type="invalid">
                          Vui lòng nhập địa chỉ.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </span>
                    
                    <span
                      style={{ marginTop: "10px" }}
                      className="gi-register-wrap"
                    >
                      <label>Mật khẩu {formData.password ? "" : "(để trống nếu không muốn thay đổi)"}</label>
                      <Form.Group className="position-relative">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Nhập mật khẩu mới"
                          value={formData.password}
                          onChange={handleInputChange}
                          minLength={8}
                        />
                        <button 
                          type="button" 
                          className="position-absolute end-0 top-50 translate-middle-y bg-transparent border-0 pe-2"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ right: '10px', zIndex: 10 }}
                        >
                          <i className={`fi ${showPassword ? 'fi-rr-eye' : 'fi-rr-eye-crossed'}`}></i>
                        </button>
                        <Form.Control.Feedback type="invalid">
                          Mật khẩu phải có ít nhất 8 ký tự.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </span>
                    
                    <span
                      style={{ marginTop: "10px" }}
                      className="gi-register-wrap"
                    >
                      <div className="gi-leave-form">
                        <Form.Group>
                          <label>Mô tả bản thân</label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            placeholder="Nhập mô tả về bản thân"
                            value={formData.description || ""}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </div>
                    </span>

                    <span
                      style={{ paddingTop: "10px", marginTop: "10px" }}
                      className="gi-register-wrap"
                    >
                      <label>Ảnh đại diện</label>
                      <input
                        style={{ paddingTop: "10px" }}
                        type="file"
                        id="avatarUrl"
                        name="avatarUrl"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="form-control"
                      />
                      {imagePreview && (
                        <div style={{ marginTop: "10px" }}>
                          <img
                            src={imagePreview}
                            alt="Ảnh đại diện"
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
                          />
                        </div>
                      )}
                    </span>
                    
                    <span
                      style={{ justifyContent: "end", marginTop: "10px" }}
                      className="gi-register-wrap gi-register-btn"
                    >
                      <button className="gi-btn-1" type="submit">
                        Lưu thông tin
                      </button>
                    </span>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfileEdit;
