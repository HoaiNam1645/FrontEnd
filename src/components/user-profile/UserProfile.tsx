"use client";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import VendorSidebar from "../vendor-sidebar/VendorSidebar";
import axios from "axios";
import { showErrorToast } from "../toast-popup/Toastify";

export interface UserData {
  _id: string;
  name: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl?: string | null;
  description?: string;
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const loginUserData = localStorage.getItem("login_user");
  const idUser = loginUserData ? JSON.parse(loginUserData).id : null;
  const login = useSelector((state: RootState) => state.registration.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!idUser) {
          throw new Error("Không tìm thấy ID người dùng");
        }
        const response = await axios.get(`http://localhost:5001/api/users/get/${idUser}`);
        const userData = response.data.data;
        setUserData({
          _id: userData._id,
          name: userData.fullName || '',
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          avatarUrl: userData.avatarUrl,
          description: userData.description || ''
        });
      } catch (error: any) {
        showErrorToast(error.response?.data?.message || "Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    if (login) {
      fetchUserData();
    }
  }, [login]);

  if (!login) {
    return (
      <div className="container">
        <p>
          Vui lòng <a href="/login">đăng nhập</a> hoặc <a href="/register">đăng ký</a>{" "}
          để xem trang này.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!userData) {
    return <div>Không tìm thấy thông tin người dùng</div>;
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    router.push("/profile-edit");
  };

  return (
    <>
      <section className="gi-vendor-profile padding-tb-40">
        <div className="container">
          <Row className="mb-minus-24px">
            <VendorSidebar />
            <Col lg={9} md={12} className="mb-24">
              <Row>
                <div className="container">
                  <div className="gi-vendor-cover" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 0 15px rgba(0, 0, 0, 0.08)' }}>
                    <span
                      style={{ float: "inline-end", margin: "15px" }}
                      className="gi-register-wrap"
                    >
                      <button
                        onClick={handleSubmit}
                        style={{
                          backgroundColor: "#3498db",
                          color: "white",
                          padding: "8px 15px",
                          borderRadius: "6px",
                          border: "none",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                          cursor: "pointer",
                          transition: "all 0.3s ease"
                        }}
                        className=""
                        type="submit"
                      >
                        Chỉnh sửa <i className="fi fi-rr-pencil"></i>
                      </button>
                    </span>
                    <div className="detail" style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="avatar-container" style={{ position: 'relative', width: '120px', height: '120px', marginRight: '20px' }}>
                        {userData.avatarUrl ? (
                          <img
                            src={userData.avatarUrl}
                            alt="avatar"
                            className="user-avatar"
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover', 
                              borderRadius: '50%',
                              border: '3px solid #f5f5f5',
                              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                        ) : (
                          <div 
                            className="default-avatar"
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              backgroundColor: '#e9f0f8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '40px',
                              color: '#3498db',
                              fontWeight: 'bold',
                              border: '3px solid #f5f5f5',
                              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            {userData.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="v-detail">
                        <h5 style={{ fontSize: '22px', marginBottom: '10px', color: '#333' }}>{userData.fullName}</h5>
                        <p style={{ color: '#666', fontSize: '14px' }}>{userData.description || "Chưa có mô tả"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Row>
              <div className="gi-vendor-profile-card gi-vendor-profile-card" style={{ marginTop: '20px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 0 15px rgba(0, 0, 0, 0.08)' }}>
                <div className="gi-vendor-card-body">
                  <div className="gi-vender-about-block" style={{ textAlign: "center", borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
                    <h5 style={{ fontWeight: 'bold', color: '#333' }}>THÔNG TIN TÀI KHOẢN</h5>
                  </div>
                  <Row className="mb-minus-24px">
                    <div className="col-md-6 col-sm-12 mb-24">
                      <div className="gi-vendor-detail-block" style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', height: '100%' }}>
                        <h6 style={{ color: '#3498db', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                          <i className="fi fi-rr-user" style={{ marginRight: '8px' }}></i>
                          Họ và tên
                        </h6>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                          <li style={{ display: 'flex', alignItems: 'center' }}>
                            <strong style={{ minWidth: '120px' }}>Họ và tên: </strong>
                            <span style={{ color: '#333' }}>{userData.fullName}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12 mb-24">
                      <div className="gi-vendor-detail-block" style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', height: '100%' }}>
                        <h6 style={{ color: '#3498db', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                          <i className="fi fi-rr-phone-call" style={{ marginRight: '8px' }}></i>
                          Số điện thoại
                        </h6>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                          <li style={{ display: 'flex', alignItems: 'center' }}>
                            <strong style={{ minWidth: '120px' }}>Số điện thoại: </strong>
                            <span style={{ color: '#333' }}>{userData.phone}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12 mb-24">
                      <div className="gi-vendor-detail-block" style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', height: '100%' }}>
                        <h6 style={{ color: '#3498db', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                          <i className="fi fi-rr-envelope" style={{ marginRight: '8px' }}></i>
                          Địa chỉ email
                        </h6>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                          <li style={{ display: 'flex', alignItems: 'center' }}>
                            <strong style={{ minWidth: '120px' }}>Email: </strong>
                            <span style={{ color: '#333' }}>{userData.email}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12 mb-24">
                      <div className="gi-vendor-detail-block" style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', height: '100%' }}>
                        <h6 style={{ color: '#3498db', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                          <i className="fi fi-rr-marker" style={{ marginRight: '8px' }}></i>
                          Địa chỉ
                        </h6>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                          <li style={{ display: 'flex', alignItems: 'center' }}>
                            <strong style={{ minWidth: '120px' }}>Địa chỉ: </strong>
                            <span style={{ color: '#333' }}>{userData.address}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default UserProfile;
