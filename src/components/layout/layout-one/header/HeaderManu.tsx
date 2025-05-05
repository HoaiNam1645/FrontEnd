"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import home from "../../../../utility/header/home";
import classic from "../../../../utility/header/classic";
import banner from "../../../../utility/header/benner";
import column from "../../../../utility/header/columns";
import list from "../../../../utility/header/list";
import blog from "../../../../utility/header/blog";
import pages from "../../../../utility/header/pages";
import fruits from "../../../../utility/header/fruits";
import bakery from "../../../../utility/header/bakery";
import snacks from "../../../../utility/header/snacks";
import spice from "../../../../utility/header/spice";
import juice from "../../../../utility/header/juice";
import softdrink from "../../../../utility/header/softdrink";
import Link from "next/link";
import productpage from "../../../../utility/header/productpage";
import CurrentLocation from "./CurrentLocation";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Fade } from "react-awesome-reveal";
import { usePathname } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  image_url: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image_url: string;
  category_id: string;
}

function HeaderManu() {
  const pathname = usePathname();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<{ [key: string]: Product[] }>({});
  const [loading, setLoading] = useState(true);

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/categories/getAll');
        if (response.data.success) {
          setCategories(response.data.data);
          // Lấy sản phẩm cho mỗi danh mục
          response.data.data.forEach((category: Category) => {
            fetchProductsByCategory(category._id);
          });
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách categories:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProductsByCategory = async (categoryId: string) => {
      try {
        const response = await axios.get(`http://localhost:5001/api/products/getAll?category=${categoryId}`);
        if (response.data.success) {
          setProducts(prev => ({
            ...prev,
            [categoryId]: response.data.data
          }));
        }
      } catch (error) {
        console.error(`Lỗi khi lấy sản phẩm cho danh mục ${categoryId}:`, error);
      }
    };

    fetchCategories();
  }, []);

  const handleProductClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <>
      <div className="gi-header-cat d-none d-lg-block">
        <div className="container position-relative">
          <div className="gi-nav-bar">
            {/* <!-- Category Toggle --> */}
            <Tabs
              selectedIndex={selectedIndex}
              onSelect={(selectedIndex) => setSelectedIndex(selectedIndex)}
              className="gi-category-icon-block"
            >
              <div className="gi-category-menu">
                <div className="gi-category-toggle">
                  <i className="fi fi-rr-apps"></i>
                  <span className="text">Tất cả danh mục</span>
                  <i
                    className="fi-rr-angle-small-down d-1199 gi-angle"
                    aria-hidden="true"
                  ></i>
                </div>
              </div>
              <div className="gi-cat-dropdown">
                <div className="gi-cat-block">
                  <div className="gi-cat-tab">
                    <TabList>
                      <div
                        className="gi-tab-list nav flex-column nav-pills me-3"
                        id="v-pills-tab"
                        role="tablist"
                        aria-orientation="vertical"
                      >
                        {loading ? (
                          <div className="loading-text">Đang tải danh mục...</div>
                        ) : (
                          categories.map((category, index) => (
                            <Tab key={category._id}>
                              <button
                                className={`tab nav-link ${
                                  selectedIndex === index ? "active" : ""
                                }`}
                                onClick={() => handleProductClick(index)}
                                id={`v-pills-${category._id}-tab`}
                                data-bs-toggle="pill"
                                data-bs-target={`#v-pills-${category._id}`}
                                type="button"
                                role="tab"
                                aria-controls={`v-pills-${category._id}`}
                                aria-selected={selectedIndex === index}
                                style={{
                                  padding: "10px 50px 10px 20px",
                                  marginBottom: "10px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: "200px"
                                }}
                              >
                                <i className="fi-rr-cupcake"></i>
                                <span className="category-name">{category.name}</span>
                              </button>
                            </Tab>
                          ))
                        )}
                      </div>
                    </TabList>
                    <div className="tab-content" id="v-pills-tabContent">
                      {categories.map((category, index) => (
                        <Fade key={category._id} duration={500} delay={200}>
                          <TabPanel
                            className={`tab-pane fade ${
                              selectedIndex === index ? "show active product-block" : ""
                            }`}
                            role="tabpanel"
                            aria-labelledby={`v-pills-${category._id}-tab`}
                          >
                            <div className="tab-list row">
                              <div className="col">
                                <h6 className="gi-col-title">{category.name}</h6>
                                <ul className="cat-list">
                                  {products[category._id]?.map((product) => (
                                    <li key={product._id}>
                                      <Link href={`/shop-left-sidebar-col-3?productId=${product._id}`}>
                                        <div className="product-item">
                                          <img 
                                            src={product.image_url} 
                                            alt={product.name}
                                            style={{ width: '30px', height: '30px', marginRight: '10px' }}
                                          />
                                          <span>{product.name}</span>
                                          <span className="price">{product.price.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </TabPanel>
                        </Fade>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Tabs>

            {/* <!-- Main Menu Start --> */}
            <div
              id="gi-main-menu-desk"
              className="d-none d-lg-block sticky-nav"
            >
              <div className="nav-desk">
                <div className="row">
                  <div className="col-md-12 align-self-center">
                    <div className="gi-main-menu">
                      <ul>
                        <li className="dropdown drop-list">
                          <Link href="/" className="dropdown-arrow">
                            Trang chủ
                          </Link>
                        </li>
                        <li className="dropdown drop-list">
                          <Link href="/shop-left-sidebar-col-3/" className="dropdown-arrow">
                            Danh mục<i className="fi-rr-angle-small-right"></i>
                          </Link>
                          <ul className="sub-menu">
                            {categories.map((category) => (
                              <li key={category._id}>
                                <Link href={`/shop-left-sidebar-col-3?categoryId=${category._id}`}>
                                  {category.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                        {/* <li className="dropdown drop-list">
                          <Link href="" className="dropdown-arrow">
                            Sản phẩm<i className="fi-rr-angle-small-right"></i>
                          </Link>
                        </li> */}
                        <li className="dropdown drop-list">
                          <Link href="/blog-left-sidebar" className="dropdown-arrow">
                            Tin Tức
                          </Link>
                          {/* <ul className="sub-menu">
                            {blog.map((data, index) => (
                              <li key={index}>
                                <Link href={data.href}>{data.name}</Link>
                              </li>
                            ))}
                          </ul> */}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- Main Menu End --> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderManu;
