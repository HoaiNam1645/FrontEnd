"use client";

import { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import AdminRoute from "@/components/protected-route/AdminRoute";
import axios from "axios";
import Link from "next/link";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import "../admin.css";

interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  status: string;
  joinDate?: string;
  profilePhoto?: string;
}

function AdminProfileContent() {
  const router = useRouter();
  const [userData, setUserData] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem("login_user") ? JSON.parse(localStorage.getItem("login_user") || '{}') : null;
  const isAuthenticated = useSelector((state: RootState) => state.registration.isAuthenticated);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        console.error("Không tìm thấy ID người dùng");
        setLoading(false);
        return;
      }

      try {
        console.log("Đang tải thông tin admin với ID:", user.id);
        const token = localStorage.getItem("login_token");
        const response = await axios.get(`http://localhost:5001/api/users/get/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Thông tin admin:", response.data.data);
        setUserData(response.data.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin admin:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchUserData();
    }
  }, [isAuthenticated, user]);

  if (loading) {
    return <div className="text-center p-5">Đang tải thông tin...</div>;
  }

  if (!userData) {
    return <div className="text-center p-5">Không thể tải thông tin admin. Vui lòng thử lại sau.</div>;
  }

  return (
    <div className="admin-profile-container">
      <div className="page-header">
        <h1>Thông Tin Cá Nhân</h1>
        <div>
          <Link href="/admin" className="btn btn-secondary me-2">
            <FaArrowLeft /> Quay Lại
          </Link>
          <Link href={`/admin/edit/${userData._id}`} className="btn btn-primary">
            <FaEdit /> Chỉnh Sửa
          </Link>
        </div>
      </div>

      <Row>
        <Col md={4}>
          <Card className="profile-card">
            <Card.Body className="text-center">
              <div className="profile-image mb-4">
                {userData.profilePhoto ? (
                  <img
                    src={userData.profilePhoto}
                    alt={userData.fullName}
                    className="img-fluid rounded-circle profile-picture"
                  />
                ) : (
                  <div className="default-avatar">{userData.fullName.charAt(0)}</div>
                )}
              </div>
              <h3 className="mb-1">{userData.fullName}</h3>
              <p className="text-muted mb-3">{userData.role}</p>
              {userData.joinDate && (
                <p className="text-muted small">Tham gia: {new Date(userData.joinDate).toLocaleDateString('vi-VN')}</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="info-card">
            <Card.Body>
              <h4 className="card-title">Thông Tin Chi Tiết</h4>
              <hr />

              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Họ và Tên:</strong>
                </Col>
                <Col sm={8}>{userData.fullName}</Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Email:</strong>
                </Col>
                <Col sm={8}>{userData.email}</Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Số Điện Thoại:</strong>
                </Col>
                <Col sm={8}>{userData.phone || "Chưa cập nhật"}</Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Địa Chỉ:</strong>
                </Col>
                <Col sm={8}>{userData.address || "Chưa cập nhật"}</Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Chức Vụ:</strong>
                </Col>
                <Col sm={8}>
                  <span className="position-badge">{userData.role}</span>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Trạng Thái:</strong>
                </Col>
                <Col sm={8}>
                  <span className={`permission-badge ${userData.status}`}>
                    {userData.status === "active" ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

// Bọc component với AdminRoute để bảo vệ trang
export default function AdminProfilePage() {
  return (
    <AdminRoute>
      <AdminProfileContent />
    </AdminRoute>
  );
} 