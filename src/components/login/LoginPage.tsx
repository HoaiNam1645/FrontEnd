"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { useRouter } from "next/navigation";
import { Container, Form } from "react-bootstrap";
import { showErrorToast, showSuccessToast } from "../toast-popup/Toastify";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/reducers/registrationSlice";
import { RootState } from "@/store";
import axios from "axios";
import { FaGoogle } from "react-icons/fa";

const LoginPage = () => {
  // Always declare all hooks at the top level
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [redirected, setRedirected] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.registration.isAuthenticated
  );

  // Check for authentication
  useEffect(() => {
    // Kiểm tra nếu đã đăng nhập
    if (isAuthenticated) {
      const userRoleStr = localStorage.getItem('login_user');
      const userRole = userRoleStr ? JSON.parse(userRoleStr).role : null;
      
      if (userRole === 'admin') {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, router]);

  // Check for redirect - use a state variable to track if we've already processed the redirect
  useEffect(() => {
    if (redirected) return;
  
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      setRedirected(true);
      localStorage.removeItem('redirectAfterLogin');
  
      // Sử dụng router.push để tránh lỗi render hooks
      router.push(redirectPath);
    }
  }, [redirected, router]);
  
  const handleLogin = async (e: any) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;

        if (!token || !user) {
          throw new Error("Dữ liệu trả về không hợp lệ");
        }

        // Lưu token & user vào localStorage
        localStorage.setItem("login_token", token);
        localStorage.setItem("login_user", JSON.stringify(user));

        // Dispatch action đăng nhập
        dispatch(login(user));

        showSuccessToast("Đăng nhập thành công");
        
        // Navigate after login completes
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }
    } catch (error: any) {
      console.error("Login error:", error.response?.data?.message || "Đăng nhập thất bại");
      showErrorToast(error.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Lưu URL hiện tại để sau khi đăng nhập xong quay lại
      const currentOrigin = window.location.origin;
      const callbackUrl = `${currentOrigin}/auth/google-callback`;
      
      // Redirect to Google OAuth endpoint
      window.location.href = `http://localhost:5001/api/auth/google?redirect_uri=${encodeURIComponent(callbackUrl)}`;
    } catch (error: any) {
      console.error("Google login error:", error);
      showErrorToast("Đăng nhập Google thất bại");
    }
  };

  return (
    <>
      <Breadcrumb title="Login Page" />
      <section className="gi-login padding-tb-40">
        <Container>
          <div className="section-title-2">
            <h2 className="gi-title">
              Đăng nhập<span></span>
            </h2>
            <p>Nhận quyền truy cập vào đơn hàng, yêu thích và gợi ý.</p>
          </div>
          <div className="gi-login-content">
            <div className="gi-login-box">
              <div className="gi-login-wrapper">
                <div className="gi-login-container">
                  <div className="gi-login-form">
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleLogin}
                    >
                      <span className="gi-login-wrap">
                        <label>Email Address*</label>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập địa chỉ email của bạn..."
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Vui lòng nhập đúng email.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </span>

                      <span
                        style={{ marginTop: "24px" }}
                        className="gi-login-wrap"
                      >
                        <label>Password*</label>
                        <Form.Group>
                          <Form.Control
                            type="password"
                            name="password"
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu của bạn..."
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Mật khẩu phải có ít nhất 6 ký tự
                          </Form.Control.Feedback>
                        </Form.Group>
                      </span>

                      <span className="gi-login-wrap gi-login-fp">
                        <label>
                          <Link href="/forgot-password">Quên mật khẩu?</Link>
                        </label>
                      </span>
                      <span className="gi-login-wrap gi-login-btn">
                        <span>
                          <Link href="/register">
                            Tạo tài khoản?
                          </Link>
                        </span>
                        <button
                          className="gi-btn-1 btn"
                          type="submit"
                        >
                          Đăng nhập
                        </button>
                      </span>
                      <div className="mt-3 text-center">
                        <p className="mb-2">Hoặc đăng nhập với</p>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={handleGoogleLogin}
                        >
                          <FaGoogle className="me-2" />
                          Đăng nhập với Google
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default LoginPage;
