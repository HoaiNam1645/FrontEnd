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
  profilePhoto?: string;
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
        const response = await axios.get(`http://localhost:5000/api/users/get/${idUser}`);
        setUserData(response.data.data);
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
                  <div className="gi-vendor-cover">
                    <span
                      style={{ float: "inline-end", margin: "15px" }}
                      className="gi-register-wrap"
                    >
                      <button
                        onClick={handleSubmit}
                        style={{
                          backgroundColor: "white",
                          padding: "5px 10px",
                          borderRadius: "4px",
                        }}
                        className=""
                        type="submit"
                      >
                        Chỉnh sửa <i className="fi fi-rr-pencil"></i>
                      </button>
                    </span>
                    <div className="detail">
                      <img
                        src={
                          userData.profilePhoto ||
                          process.env.NEXT_PUBLIC_URL +
                            "/assets/img/avatar/placeholder.jpg"
                        }
                        alt="vendor"
                      />
                      <div className="v-detail">
                        <h5>{userData.fullName}</h5>
                        <p>{userData.description || "Chưa có mô tả"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Row>
              <div className="gi-vendor-profile-card gi-vendor-profile-card">
                <div className="gi-vendor-card-body">
                  <div className="gi-vender-about-block" style={{textAlign: "center"}}>
                    <h5>ACCOUNT INFORMATION</h5>
                  </div>
                  <Row className="mb-minus-24px">
                    <div className="col-md-6 col-sm-12 mb-24">
                      <div className="gi-vendor-detail-block">
                        <h6>Full name</h6>
                        <ul>
                          <li>
                            <strong>Full name: </strong>
                            {userData.fullName}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12 mb-24">
                      <div className="gi-vendor-detail-block">
                        <h6>Phone Number</h6>
                        <ul>
                          <li>
                            <strong>Phone Number: </strong>
                            {userData.phone}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12 mb-24">
                      <div className="gi-vendor-detail-block">
                        <h6>Email address</h6>
                        <ul>
                          <li>
                            <strong>Email: </strong>
                            {userData.email}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12 mb-24">
                      <div className="gi-vendor-detail-block">
                        <h6>Address</h6>
                        <ul>
                          <li>
                            <strong>Address: </strong>
                            {userData.address}
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
