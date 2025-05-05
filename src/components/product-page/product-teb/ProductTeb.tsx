"use client";
import React, { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Fade } from "react-awesome-reveal";
import RatingComponent from "@/components/stars/RatingCompoents";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Form } from "react-bootstrap";
import { Col, Row } from "react-bootstrap";
import "react-tabs/style/react-tabs.css";
import { reviewsApi } from "@/utils/api";
import { log } from "console";

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postCode: string;
  country: string;
  state: string;
  profilePhoto?: string;
  description: string;
  _id?: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  fullName?: string;
  avataUrl?: string | null;
}

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profilePhoto?: string;
}

interface ProductTebProps {
  productId: string;
  reviews?: Review[];
}

const getUserData = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("login_user");
    return data ? JSON.parse(data) : null;
  }
  return null;
};

const ProductTeb = ({ productId, reviews: apiReviews = [] }: ProductTebProps) => {
  const login = useSelector(
    (state: RootState) => state.registration.isAuthenticated
  );
  const [userData, setUserData] = useState<UserData | null>(null);
  const [validated, setValidated] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Sử dụng đánh giá từ API
  useEffect(() => {
    if (apiReviews && apiReviews.length > 0) {
      setReviews(apiReviews);
    }
  }, [apiReviews]);

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const loggedInUser = getUserData();
    if (loggedInUser) {
      console.log('Thông tin người dùng:', loggedInUser);
      setUserData(loggedInUser);
    }
  }, []);

  const handleProductClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!userData || !userData.id) {
      console.error("Thông tin người dùng không hợp lệ:", userData);
      setSubmitError("Thông tin người dùng không hợp lệ");
      return;
    }

    if (!rating) {
      setSubmitError("Vui lòng chọn số sao đánh giá");
      return;
    }

    if (!comment.trim()) {
      setSubmitError("Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const reviewData = {
        userId: userData.id,
        productId: productId,
        rating: rating,
        comment: comment
      };

      console.log("Dữ liệu gửi đánh giá:", reviewData);
      
      const response = await reviewsApi.createReview(reviewData);
      console.log("Kết quả gửi đánh giá:", response.data);
      
      if (response.status === 200 || response.status === 201) {
        // Tạo đánh giá mới để hiển thị ngay
        const newReview: Review = {
          _id: response.data?.data?._id || Date.now().toString(),
          productId: productId,
          userId: userData.id,
          rating: rating,
          comment: comment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          fullName: userData.fullName,
          avataUrl: userData.profilePhoto || null
        };

        // Thêm đánh giá mới vào đầu danh sách
        setReviews([newReview, ...reviews]);

        // Reset form
        setComment("");
        setRating(0);
        setValidated(false);
      }
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      setSubmitError("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format thời gian
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Tabs
        selectedIndex={selectedIndex}
        onSelect={(selectedIndex) => setSelectedIndex(selectedIndex)}
        className="gi-single-pro-tab"
      >
        <div className="gi-single-pro-tab-wrapper">
          <TabList className="gi-single-pro-tab-nav">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <Tab className="nav-item" role="presentation" key={"review"}>
                <button
                  className="nav-link active"
                  id="review-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#gi-spt-nav-review"
                  type="button"
                  role="tab"
                  aria-controls="gi-spt-nav-review"
                  aria-selected="true"
                  onClick={() => handleProductClick(0)}
                >
                  Đánh giá ({reviews.length})
                </button>
              </Tab>
            </ul>
          </TabList>
          <div className="tab-content gi-single-pro-tab-content">
            <TabPanel>
            <Fade
              duration={1000}
              className="tab-pane fade show active"
            >
                {!userData ? (
                <div className="container">
                  <p>
                    Vui lòng <a href="/login">đăng nhập</a> hoặc{" "}
                    <a href="/register">đăng ký</a> để đánh giá sản phẩm.
                  </p>
                </div>
              ) : (
                <div className="row">
                  <div className="gi-t-review-wrapper">
                      {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                          <div key={review._id} className="gi-t-review-item" style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                        <div className="gi-t-review-avtar">
                          <img
                            src={
                                  review.avataUrl ||
                                "/assets/img/avatar/placeholder.jpg"
                            }
                            alt="user"
                                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        </div>
                            <div className="gi-t-review-content" style={{ paddingLeft: '15px' }}>
                          <div className="gi-t-review-top">
                                <div className="gi-t-review-name" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                  {review.fullName || "Người dùng"}
                                </div>
                                <div className="gi-t-review-rating" style={{ margin: '8px 0' }}>
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={`gicon gi-star ${
                                        i < review.rating ? "fill" : "gi-star-o"
                                  }`}
                                      style={{ color: i < review.rating ? '#FFA534' : '#ddd', marginRight: '2px' }}
                                ></i>
                              ))}
                                </div>
                                <div className="gi-t-review-date" style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                                  {formatDate(review.createdAt)}
                                </div>
                              </div>
                              <div className="gi-t-review-bottom" style={{ marginTop: '10px' }}>
                                <p style={{ margin: '0', lineHeight: '1.6' }}>{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                        </div>
                      )}
                  </div>
                  <div className="gi-ratting-content">
                    <h3>Thêm đánh giá</h3>
                    <div className="gi-ratting-form">
                      <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                        action="#"
                      >
                        <div className="gi-ratting-star">
                          <RatingComponent
                            onChange={setRating}
                            value={rating}
                          />
                        </div>
                        <div className="gi-ratting-input form-submit">
                          <Form.Group>
                            <Form.Control
                              as="textarea"
                              name="comment"
                              placeholder="Nhập đánh giá của bạn"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Vui lòng nhập đánh giá của bạn
                            </Form.Control.Feedback>
                          </Form.Group>
                            {submitError && (
                              <div className="text-danger mb-3">{submitError}</div>
                            )}
                          <button
                            style={{ marginTop: "15px" }}
                            className="gi-btn-2"
                            type="submit"
                              disabled={isSubmitting}
                          >
                              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                          </button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              )}
            </Fade>
            </TabPanel>
          </div>
        </div>
      </Tabs>
    </>
  );
};

export default ProductTeb;
