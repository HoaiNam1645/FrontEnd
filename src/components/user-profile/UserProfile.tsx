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
                  <div className="gi-vendor-cover" style={{ 
                    padding: '25px 20px', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '10px', 
                    boxShadow: '0 0 15px rgba(0, 0, 0, 0.08)',
                    backgroundImage: 'linear-gradient(to right, rgba(92, 175, 144, 0.05), rgba(92, 175, 144, 0.1))',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid #f0f0f0'
                  }}>
                    <div 
                      style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        height: '87px', 
                        background: 'linear-gradient(135deg, #5caf90 0%, #4a917a 100%)',
                        opacity: 0.85,
                        zIndex: 0
                      }} 
                    />
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'flex-end', 
                      position: 'relative', 
                      zIndex: 1, 
                      marginBottom: '45px'
                    }}>
                      <button
                        onClick={handleSubmit}
                        style={{
                          backgroundColor: "#ffffff",
                          color: "#5caf90",
                          padding: "8px 15px",
                          borderRadius: "6px",
                          border: "1px solid #5caf90",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                        type="submit"
                      >
                        Chỉnh sửa <i className="fi fi-rr-pencil" style={{ fontSize: "14px" }}></i>
                      </button>
                    </div>
                    
                    <div className="detail" style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      position: 'relative', 
                      zIndex: 1,
                      marginBottom: '10px'
                    }}>
                      <div className="avatar-container" style={{ 
                        position: 'relative', 
                        width: '120px', 
                        height: '120px', 
                        marginRight: '25px',
                        flexShrink: 0
                      }}>
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
                              border: '4px solid #ffffff',
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
                              backgroundColor: 'rgba(92, 175, 144, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '40px',
                              color: '#5caf90',
                              fontWeight: 'bold',
                              border: '4px solid #ffffff',
                              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            {userData.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="v-detail" style={{ flex: 1 }}>
                        <h5 style={{ 
                          fontSize: '24px', 
                          marginBottom: '5px', 
                          color: '#333',
                          fontWeight: '600' 
                        }}>{userData.fullName}</h5>
                        <p style={{ 
                          color: '#666', 
                          fontSize: '14px', 
                          marginBottom: '15px',
                          lineHeight: '1.4'
                        }}>{userData.description || "Chưa có mô tả"}</p>
                        
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <div style={{ 
                            padding: '8px 15px', 
                            backgroundColor: 'rgba(92, 175, 144, 0.1)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: '1px solid rgba(92, 175, 144, 0.2)'
                          }}>
                            <i className="fi fi-rr-envelope" style={{ color: '#5caf90', fontSize: '14px' }}></i>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#555' }}>{userData.email}</span>
                          </div>
                          
                          <div style={{ 
                            padding: '8px 15px', 
                            backgroundColor: 'rgba(92, 175, 144, 0.1)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: '1px solid rgba(92, 175, 144, 0.2)'
                          }}>
                            <i className="fi fi-rr-phone-call" style={{ color: '#5caf90', fontSize: '14px' }}></i>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#555' }}>{userData.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Row>
              <div className="gi-vendor-profile-card" style={{ 
                marginTop: '20px', 
                backgroundColor: '#ffffff', 
                borderRadius: '10px', 
                boxShadow: '0 0 15px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                border: '1px solid #f0f0f0'
              }}>
                <div className="gi-vendor-card-body" style={{ padding: '0' }}>
                  <div className="gi-vender-about-block" style={{ 
                    textAlign: "center", 
                    borderBottom: '1px solid #eee', 
                    marginBottom: '20px',
                    background: 'linear-gradient(135deg, rgba(92, 175, 144, 0.05) 0%, rgba(92, 175, 144, 0.1) 100%)',
                    padding: '15px 0'
                  }}>
                    <h5 style={{ 
                      fontWeight: 'bold', 
                      color: '#333',
                      margin: '0',
                      fontSize: '18px'
                    }}>THÔNG TIN TÀI KHOẢN</h5>
                  </div>
                  <Row className="mb-minus-24px" style={{ padding: '0 15px 15px' }}>
                    <div className="col-md-6 col-sm-12 mb-24">
                      <div className="gi-vendor-detail-block" style={{ 
                        padding: '15px', 
                        backgroundColor: '#f9f9f9', 
                        borderRadius: '8px', 
                        height: '100%',
                        border: '1px solid #f0f0f0',
                        transition: 'all 0.3s ease'
                      }}>
                        <h6 style={{ 
                          color: '#5caf90', 
                          borderBottom: '1px solid #eee', 
                          paddingBottom: '10px', 
                          marginBottom: '15px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <i className="fi fi-rr-user" style={{ marginRight: '8px', color: '#5caf90' }}></i>
                          Họ và tên
                        </h6>
                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                          <li style={{ display: 'flex', alignItems: 'center' }}>
                            <strong style={{ minWidth: '120px', color: '#555' }}>Họ và tên: </strong>
                            <span style={{ color: '#333', fontWeight: '500' }}>{userData.fullName}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12 mb-24">
                      <div className="gi-vendor-detail-block" style={{ 
                        padding: '15px', 
                        backgroundColor: '#f9f9f9', 
                        borderRadius: '8px', 
                        height: '100%',
                        border: '1px solid #f0f0f0',
                        transition: 'all 0.3s ease'
                      }}>
                        <h6 style={{ 
                          color: '#5caf90', 
                          borderBottom: '1px solid #eee', 
                          paddingBottom: '10px', 
                          marginBottom: '15px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <i className="fi fi-rr-phone-call" style={{ marginRight: '8px', color: '#5caf90' }}></i>
                          Số điện thoại
                        </h6>
                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                          <li style={{ display: 'flex', alignItems: 'center' }}>
                            <strong style={{ minWidth: '120px', color: '#555' }}>Số điện thoại: </strong>
                            <span style={{ color: '#333', fontWeight: '500' }}>{userData.phone}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12 mb-24">
                      <div className="gi-vendor-detail-block" style={{ 
                        padding: '15px', 
                        backgroundColor: '#f9f9f9', 
                        borderRadius: '8px', 
                        height: '100%',
                        border: '1px solid #f0f0f0',
                        transition: 'all 0.3s ease'
                      }}>
                        <h6 style={{ 
                          color: '#5caf90', 
                          borderBottom: '1px solid #eee', 
                          paddingBottom: '10px', 
                          marginBottom: '15px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <i className="fi fi-rr-envelope" style={{ marginRight: '8px', color: '#5caf90' }}></i>
                          Địa chỉ email
                        </h6>
                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                          <li style={{ display: 'flex', alignItems: 'center' }}>
                            <strong style={{ minWidth: '120px', color: '#555' }}>Email: </strong>
                            <span style={{ color: '#333', fontWeight: '500' }}>{userData.email}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12 mb-24">
                      <div className="gi-vendor-detail-block" style={{ 
                        padding: '15px', 
                        backgroundColor: '#f9f9f9', 
                        borderRadius: '8px', 
                        height: '100%',
                        border: '1px solid #f0f0f0',
                        transition: 'all 0.3s ease'
                      }}>
                        <h6 style={{ 
                          color: '#5caf90', 
                          borderBottom: '1px solid #eee', 
                          paddingBottom: '10px', 
                          marginBottom: '15px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <i className="fi fi-rr-marker" style={{ marginRight: '8px', color: '#5caf90' }}></i>
                          Địa chỉ
                        </h6>
                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                          <li style={{ display: 'flex', alignItems: 'center' }}>
                            <strong style={{ minWidth: '120px', color: '#555' }}>Địa chỉ: </strong>
                            <span style={{ color: '#333', fontWeight: '500' }}>{userData.address}</span>
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
