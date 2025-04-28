"use client";
import React, { useEffect, useState } from "react";
import { Tab, TabList, Tabs } from "react-tabs";
import { Fade } from "react-awesome-reveal";
import RatingComponent from "@/components/stars/RatingCompoents";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Form } from "react-bootstrap";
import { Col, Row } from "react-bootstrap";
import "react-tabs/style/react-tabs.css";

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
}

const getRegistrationData = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("registrationData");
    return data ? JSON.parse(data) : null;
  }
  return null;
};

const ProductTeb = () => {
  const login = useSelector(
    (state: RootState) => state.registration.isAuthenticated
  );
  const [userData, setUserData] = useState<any | null>(null);
  const [validated, setValidated] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([
    {
      name: "Nguyễn Văn A",
      rating: 3,
      comment:
        "Sản phẩm rất tốt, dùng rất bền, sẽ tiếp tục mua lần sau...",
      avatar: "/assets/img/avatar/placeholder.jpg",
    },
  ]);

  const detail = {
    text: "Đây là phần mô tả chi tiết sản phẩm, giúp khách hàng hiểu rõ hơn về sản phẩm mà bạn đang cung cấp. Hãy cập nhật nội dung này với thông tin chi tiết về sản phẩm của bạn, bao gồm các tính năng, lợi ích, và bất kỳ thông tin quan trọng nào mà khách hàng nên biết.",
  };
  const information = [
    {
      info: "Nhãn hiệu",
      detail: "Greenivi",
    },
    {
      info: "Đơn vị",
      detail: "Cái",
    },
    {
      info: "Xuất xứ",
      detail: "Việt Nam",
    },
    {
      info: "Kích thước",
      detail: "320 x 152 x 12cm",
    },
    {
      info: "Màu sắc",
      detail: "Đen, Đỏ, Xanh dương, Trắng",
    },
    {
      info: "Ngày hết hạn",
      detail: "Đang cập nhật",
    },
    {
      info: "Xuất xứ thương hiệu",
      detail: "Nhật Bản",
    },
    {
      info: "Dạng đóng gói",
      detail: "Hộp",
    },
    {
      info: "Trọng lượng",
      detail: "1.25kg",
    },
    {
      info: "Thông tin cảnh báo",
      detail: "Không có",
    },
    {
      info: "Hướng dẫn sử dụng",
      detail: "Xem hướng dẫn sử dụng trong hộp sản phẩm",
    },
  ];

  const specification = {
    list: "Thông số kỹ thuật của sản phẩm. Đối với các sản phẩm tương tự như laptop, điện thoại, và các thiết bị điện tử khác, phần này sẽ cung cấp thông tin chi tiết về cấu hình và đặc điểm kỹ thuật. Nếu sản phẩm của bạn không thuộc nhóm các sản phẩm này, bạn có thể điều chỉnh để thể hiện các thông số kỹ thuật phù hợp với loại sản phẩm của mình.",
  };

  useEffect(() => {
    if (login) {
      const data = getRegistrationData();
      if (data?.length > 0) {
        setUserData(data[data.length - 1]);
      }
    }
  }, [login]);

  const handleProductClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      if (userData && comment && rating) {
        setReviews([
          ...reviews,
          {
            name: `${userData.firstName} ${userData.lastName}`,
            rating,
            comment,
            avatar:
              userData.profilePhoto || "/assets/img/avatar/placeholder.jpg",
          },
        ]);

        setComment("");
        setRating(0);
      }
    }

    setValidated(true);
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
                  Đánh giá
                </button>
              </Tab>
            </ul>
          </TabList>
          <div className="tab-content gi-single-pro-tab-content">
            <Fade
              duration={1000}
              className="tab-pane fade show active"
            >
              {!login ? (
                <div className="container">
                  <p>
                    Vui lòng <a href="/login">đăng nhập</a> hoặc{" "}
                    <a href="/register">đăng ký</a> để đánh giá sản phẩm.
                  </p>
                </div>
              ) : (
                <div className="row">
                  <div className="gi-t-review-wrapper">
                    {reviews.map((data, index) => (
                      <div key={index} className="gi-t-review-item">
                        <div className="gi-t-review-avtar">
                          <img
                            src={
                              data.avatar ||
                              process.env.NEXT_PUBLIC_URL +
                                "/assets/img/avatar/placeholder.jpg"
                            }
                            alt="user"
                          />
                        </div>
                        <div className="gi-t-review-content">
                          <div className="gi-t-review-top">
                            <div className="gi-t-review-name">{data.name}</div>
                            <div className="gi-t-review-rating">
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={`gicon gi-star ${
                                    i < data.rating ? "fill" : "gi-star-o"
                                  }`}
                                ></i>
                              ))}
                            </div>
                          </div>
                          <div className="gi-t-review-bottom">
                            <p>{data.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
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
                          <button
                            style={{ marginTop: "15px" }}
                            className="gi-btn-2"
                            type="submit"
                          >
                            Gửi đánh giá
                          </button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              )}
            </Fade>
          </div>
        </div>
      </Tabs>
    </>
  );
};

export default ProductTeb;
