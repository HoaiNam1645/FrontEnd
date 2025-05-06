"use client";
import { Fade } from "react-awesome-reveal";
import { Col, Row } from "react-bootstrap";
import ScrollButton from "../../button/ScrollButton";
import useSWR from "swr";
import fetcher from "@/components/fetcher-api/Fetcher";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter, usePathname } from "next/navigation";
import { setSelectedCategory } from "@/store/reducers/filterReducer";
import { useState } from "react";
import { slice } from "lodash";
import { motion } from "framer-motion";
import Link from "next/link";

function Footer({ onSuccess = () => {}, onError = () => {} }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [dropdownState, setDropdownState] = useState(null);
  const { selectedCategory } = useSelector((state: RootState) => state.filter);
  const { data, error } = useSWR(`/api/shopcategory`, fetcher, {
    onSuccess,
    onError,
  });

  if (error) return <div>Failed to load categories</div>;
  if (!data) return <div></div>;

  const getData = () => {
    return data.length > 8 ? slice(data, 0, 8) : data;
  };

  const toggleDropdown = (dropdown: any) => {
    setDropdownState((menu) => (menu === dropdown ? null : dropdown));
  };

  const CategoryData = getData();

  const handleCategoryChange = (category) => {
    const updatedCategory = selectedCategory.includes(category)
      ? selectedCategory.filter((cat) => cat !== category)
      : [...selectedCategory, category];
    dispatch(setSelectedCategory(updatedCategory));
    router.push("/shop-left-sidebar-col-3");
  };

  // Kiểm tra nếu đang ở trang đăng nhập hoặc đăng ký thì không hiển thị
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <>
      <footer className="gi-footer m-t-40">
        <div className="footer-container">
          <div className="footer-top padding-tb-60">
            <div className="container">
              <Row className="justify-content-between">
                <Col sm={12} lg={5}>
                  <Fade
                    duration={400}
                    triggerOnce
                    direction="up"
                    className="gi-footer-cat"
                  >
                    <div className="gi-footer-widget">
                      <h4
                        onClick={() => toggleDropdown("category")}
                        className="gi-footer-heading"
                      >
                        Danh mục sản phẩm
                        <div className="gi-heading-res">
                          <i
                            className="fi-rr-angle-small-down"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </h4>
                      <motion.div
                        className="gi-footer-links gi-footer-dropdown"
                        initial={{ height: 0, opacity: 0, translateY: -20 }}
                        animate={{
                          height: dropdownState === "category" ? "auto" : 0,
                          opacity: dropdownState === "category" ? 1 : 0,
                          translateY: dropdownState === "category" ? 0 : -20,
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{
                          overflow: "hidden",
                          display: "block",
                          paddingBottom:
                            dropdownState === "category" ? "20px" : "0px",
                        }}
                      >
                        <Row>
                          {CategoryData.map((data, index) => (
                            <Col xs={6} md={4} key={index}>
                              <div className="gi-footer-link">
                                <a
                                  style={{ textTransform: "capitalize" }}
                                  href="#"
                                  onClick={() =>
                                    handleCategoryChange(data.category)
                                  }
                                >
                                  {data.category}
                                </a>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </motion.div>
                    </div>
                  </Fade>
                </Col>
                
                <Col sm={12} lg={5} className="gi-footer-cont-social">
                  <Fade
                    duration={400}
                    triggerOnce
                    direction="up"
                    delay={200}
                  >
                    <div className="gi-footer-contact">
                      <div className="gi-footer-widget">
                        <h4
                          onClick={() => toggleDropdown("contact")}
                          className="gi-footer-heading"
                        >
                          Liên hệ với chúng tôi
                          <div className="gi-heading-res">
                            <i
                              className="fi-rr-angle-small-down"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </h4>
                        <motion.div
                          className="gi-footer-links gi-footer-dropdown"
                          initial={{ height: 0, opacity: 0, translateY: -20 }}
                          animate={{
                            height: dropdownState === "contact" ? "auto" : 0,
                            opacity: dropdownState === "contact" ? 1 : 0,
                            translateY: dropdownState === "contact" ? 0 : -20,
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          style={{
                            overflow: "hidden",
                            display: "block",
                            paddingBottom:
                              dropdownState === "contact" ? "20px" : "0px",
                          }}
                        >
                          <ul className="align-itegi-center">
                            <li className="gi-footer-link gi-foo-location">
                              <span>
                                <i className="fi fi-rr-marker location svg_img foo_svg"></i>
                              </span>
                              <p>
                                Vinmar Center 268 Tô Hiến Thành, P.15, Q.10, TP.HCM
                              </p>
                            </li>
                            <li className="gi-footer-link gi-foo-call">
                              <span>
                                <i className="fi fi-brands-whatsapp svg_img foo_svg"></i>
                              </span>
                              <a href="tel:+84377556677">+84 377 556 677</a>
                            </li>
                            <li className="gi-footer-link gi-foo-mail">
                              <span>
                                <i className="fi fi-rr-envelope"></i>
                              </span>
                              <a href="mailto:support@webshop.vn">
                                support@webshop.vn
                              </a>
                            </li>
                          </ul>
                        </motion.div>
                      </div>
                    </div>
                    <div className="gi-footer-social mt-4">
                      <div className="gi-footer-widget">
                        <motion.div
                          className="gi-footer-links"
                          style={{
                            display: "block",
                          }}
                        >
                          <ul className="align-itegi-center d-flex">
                            <li className="gi-footer-link">
                              <a href="#">
                                <i
                                  className="gicon gi-facebook"
                                  aria-hidden="true"
                                ></i>
                              </a>
                            </li>
                            <li className="gi-footer-link">
                              <a href="#">
                                <i
                                  className="gicon gi-twitter"
                                  aria-hidden="true"
                                ></i>
                              </a>
                            </li>
                            <li className="gi-footer-link">
                              <a href="#">
                                <i
                                  className="gicon gi-linkedin"
                                  aria-hidden="true"
                                ></i>
                              </a>
                            </li>
                            <li className="gi-footer-link">
                              <a href="#">
                                <i
                                  className="gicon gi-instagram"
                                  aria-hidden="true"
                                ></i>
                              </a>
                            </li>
                          </ul>
                        </motion.div>
                      </div>
                    </div>
                  </Fade>
                </Col>
              </Row>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="container">
              <div className="row">
                <div className="gi-bottom-info">
                  <div className="footer-copy">
                    <div className="footer-bottom-copy ">
                      <div className="gi-copy">
                        Copyright ©{" "}
                        <Link className="site-name" href="/">
                          WebShop{" "}
                        </Link>
                        all rights reserved. 2024.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ScrollButton />
    </>
  );
}

export default Footer;
