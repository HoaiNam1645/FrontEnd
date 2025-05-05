"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import SidebarCart from "../../../model/SidebarCart";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store";
import { logout, setUserData } from "@/store/reducers/registrationSlice";
import { setSearchTerm } from "@/store/reducers/filterReducer";
import { fetchUserCartAsync } from "@/store/reducers/cartSlice";

interface User {
  _id: string;
  [key: string]: any;
}

function HeaderTwo({ cartItems, wishlistItems }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.registration.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.registration.user) as User | null;
  const { searchTerm } = useSelector((state: RootState) => state.filter);
  const [searchInput, setSearchInput] = useState(searchTerm || "");

  useEffect(() => {
    const userdata = localStorage.getItem("login_user") ?? "";
    const user = userdata !== "" ? JSON.parse(userdata) : null;
    dispatch(setUserData({ isAuthenticated: userdata !== "", user }));
  }, [dispatch]);

  // Load giỏ hàng từ API khi người dùng đăng nhập
  useEffect(() => {
    if (isAuthenticated && user && user._id) {
      dispatch(fetchUserCartAsync(user._id));
    }
  }, [isAuthenticated, user, dispatch]);

  const handleSearch = (event: any) => {
    setSearchInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(setSearchTerm(searchInput));
    router.push("/shop-full-width-col-4");
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("login_user");
    localStorage.removeItem("login_token");
    dispatch(logout());
    window.location.href = "/login";
  };

  // Tính tổng giá trị giỏ hàng
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <>
      <div className="gi-header-bottom d-lg-block">
        <div className="container position-relative">
          <div className="row">
            <div className="gi-flex">
              {/* <!-- Header Logo Start --> */}
              <div className="align-self-center gi-header-logo">
                <div className="header-logo">
                  <Link href="/">
                    <img style={{ height: "80px", width: "auto" }}
                      src="/assets/img/logo/logo.png"
                      alt="Site Logo"
                    />
                  </Link>
                </div>
              </div>
              {/* <!-- Header Logo End -->
                        <!-- Header Search Start --> */}
              <div className="align-self-center gi-header-search">
                <div className="header-search">
                  <form
                    onSubmit={handleSubmit}
                    className="gi-search-group-form"
                    action="#"
                  >
                    <input
                      className="form-control gi-search-bar"
                      placeholder="Tìm kiếm sản phẩm..."
                      type="text"
                      value={searchInput}
                      onChange={handleSearch}
                    />
                    <button className="search_submit" type="submit">
                      <i className="fi-rr-search"></i>
                    </button>
                  </form>
                </div>
              </div>
              {/* <!-- Header Search End -->
                        <!-- Header Button Start --> */}
              <div className="gi-header-action align-self-center">
                <div className="gi-header-bottons">
                  {/* <!-- Header User Start --> */}
                  <div className="gi-acc-drop">
                    <Link
                      href=""
                      className="gi-header-btn gi-header-user dropdown-toggle gi-user-toggle gi-header-rtl-btn"
                      title="Tài khoản"
                    >
                      <div className="header-icon">
                        <i className="fi-rr-user"></i>
                      </div>
                      <div className="gi-btn-desc">
                        <span className="gi-btn-title">Tài khoản</span>
                        <span className="gi-btn-stitle">
                          {" "}
                          {isAuthenticated ? "Đăng xuất" : "Đăng nhập"}
                        </span>
                      </div>
                    </Link>
                    <ul className="gi-dropdown-menu">
                      {isAuthenticated ? (
                        <>
                          <li>
                            <Link
                              className="dropdown-item"
                              href="/user-profile"
                            >
                              Hồ sơ của tôi
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" href="/track-order">
                              Đơn hàng
                            </Link>
                          </li>
                          <li>
                            <a className="dropdown-item" onClick={handleLogout}>
                              Đăng xuất
                            </a>
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Link className="dropdown-item" href="/register">
                              Đăng ký
                            </Link>
                          </li>
                          {/* <li>
                            <Link className="dropdown-item" href="/checkout">
                              Thanh toán
                            </Link>
                          </li> */}
                          <li>
                            <Link className="dropdown-item" href="/login" onClick={(e) => {
                              e.preventDefault();
                              window.location.href = "/login";
                            }}>
                              Đăng nhập
                            </Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  {/* <!-- Header User End -->
                                <!-- Header wishlist Start --> */}
                  <Link
                    href="/wishlist"
                    className="gi-header-btn gi-wish-toggle gi-header-rtl-btn"
                    title="Yêu thích"
                  >
                    <div className="header-icon">
                      <i className="fi-rr-heart"></i>
                    </div>
                    <div className="gi-btn-desc">
                      <span className="gi-btn-title">Yêu thích</span>
                      <span className="gi-btn-stitle">
                        <b className="gi-wishlist-count">
                          {wishlistItems.length}
                        </b>
                        {wishlistItems.length > 0 && " sản phẩm"}
                      </span>
                    </div>
                  </Link>
                  {/* <!-- Header wishlist End -->
                                <!-- Header Cart Start --> */}
                  <Link
                    onClick={openCart}
                    href="#"
                    className="gi-header-btn gi-cart-toggle gi-header-rtl-btn"
                    title="Giỏ hàng"
                  >
                    <div className="header-icon">
                      <i className="fi-rr-shopping-bag"></i>
                      {cartItems.length > 0 && <span className="main-label-note-new"></span>}
                    </div>
                    <div className="gi-btn-desc">
                      <span className="gi-btn-title">Giỏ hàng</span>
                      <span className="gi-btn-stitle">
                        {isAuthenticated && (
                          <>
                            <b className="gi-cart-count">{cartItems.length}</b>
                            {cartItems.length > 0 && (
                              <>{" "}- {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                              }).format(cartTotal)}</>
                            )}
                          </>
                        )}
                      </span>
                    </div>
                  </Link>
                  {/* <!-- Header Cart End --> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SidebarCart isCartOpen={isCartOpen} closeCart={closeCart} />
    </>
  );
}

export default HeaderTwo;
