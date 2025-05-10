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

interface Product {
  _id: string;
  name: string;
  price: number;
  image_url: string;
}

// API domain for images
const API_DOMAIN = "http://localhost:5001";

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
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

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

  // Search products function
  const searchProducts = async (query: string) => {
    if (query.trim().length > 0) {
      try {
        const response = await fetch('http://localhost:5001/api/products/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: query }),
        });
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setSearchResults(result.data);
          setShowSearchResults(true);
        }
      } catch (error) {
        console.error('Error searching products:', error);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Search products when input changes
  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      searchProducts(searchInput);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const handleSearch = (event: any) => {
    setSearchInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(setSearchTerm(searchInput));
    // Explicitly trigger search and show results
    searchProducts(searchInput);
  };

  const handleProductClick = (productId: string) => {
    setShowSearchResults(false);
    router.push(`/product-left-sidebar/${productId}`);
  };

  const handleClickOutside = () => {
    setShowSearchResults(false);
    setSearchInput(''); // Clear search input when clicking outside
  };

  useEffect(() => {
    // Reset search input on page refresh
    return () => {
      setSearchInput('');
    };
  }, []);

  useEffect(() => {
    // Add click event listener to detect clicks outside search results
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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
              <div className="align-self-center gi-header-search position-relative">
                <div className="header-search">
                  <form
                    onSubmit={handleSubmit}
                    className="gi-search-group-form"
                    action="#"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
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
                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div 
                    className="search-results-dropdown" 
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 5px)',
                      left: 0,
                      right: 0,
                      backgroundColor: '#fff',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                      borderRadius: '8px',
                      zIndex: 1000,
                      maxHeight: '400px',
                      overflowY: 'auto',
                      border: '1px solid #eaeaea'
                    }}
                  >
                    <div style={{ padding: '15px 15px 5px', borderBottom: '1px solid #eaeaea' }}>
                      <h5 style={{ margin: 0, fontSize: '16px', color: '#333' }}>Kết quả tìm kiếm ({searchResults.length})</h5>
                    </div>
                    <div className="search-results-container">
                      {searchResults.map((product) => (
                        <div 
                          key={product._id}
                          className="search-item"
                          onClick={() => handleProductClick(product._id)}
                          style={{
                            padding: '12px 15px',
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '1px solid #f5f5f5',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                        >
                          <div className="product-image" style={{ 
                            marginRight: '15px', 
                            width: '70px', 
                            height: '70px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            border: '1px solid #eaeaea'
                          }}>
                            <img 
                              src={product.image_url.startsWith('http') ? product.image_url : `${API_DOMAIN}${product.image_url}`} 
                              alt={product.name} 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />
                          </div>
                          <div className="product-info" style={{ flex: 1 }}>
                            <div className="product-name" style={{ 
                              fontWeight: 'bold', 
                              fontSize: '15px',
                              marginBottom: '5px',
                              color: '#333'
                            }}>{product.name}</div>
                            <div className="product-price" style={{
                              color: '#ff6b6b',
                              fontWeight: 'bold',
                              fontSize: '14px'
                            }}>
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                              }).format(product.price)}
                            </div>
                          </div>
                          <div className="action-icon" style={{ color: '#aaa' }}>
                            <i className="fi-rr-angle-right"></i>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ 
                      padding: '10px 15px', 
                      textAlign: 'center', 
                      borderTop: '1px solid #eaeaea',
                      fontSize: '14px'
                    }}>
                      
                    </div>
                  </div>
                )}
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
