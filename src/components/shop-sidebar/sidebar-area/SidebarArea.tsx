"use client";
import { useEffect, useState } from "react";
import PriceRangeSlider from "../../price-range/PriceRangeSlider";
import { GoChevronDown } from "react-icons/go";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Collapse from 'react-bootstrap/Collapse';
import axios from 'axios';

interface Category {
  _id: string;
  name: string;
  image_url: string;
  createdAt: string;
  updatedAt: string;
}

const SidebarArea = ({
  handleCategoryChange,
  handleWeightChange,
  handleColorChange,
  handleTagsChange,
  selectedColor,
  selectedTags,
  selectedCategory,
  selectedWeight,
  closeFilter,
  handlePriceChange,
  min,
  max,
  isFilterOpen,
  order = "order-first",
  none = "",
}: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showButton, setShowButton] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState({
    category: true,
    weight: true,
    color: true,
    price: true,
    tags: true,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/categories/getAll');
        setCategories(response.data.data);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh mục sản phẩm');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const hiddenPaths = [
      "/product-left-sidebar/",
      "/product-right-sidebar/",
      "/product-according-left-sidebar/",
      "/product-according-right-sidebar/",
    ];
    setShowButton(hiddenPaths.includes(pathname));
  }, [pathname]);

  const toggleDropdown = (section: keyof typeof isOpen) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  if (error) return <div className="text-danger">{error}</div>;
  if (loading) return <div>Đang tải...</div>;

  return (
    <>
      {isFilterOpen && (
        <div className="filter-sidebar-overlay" onClick={closeFilter}></div>
      )}
      <div
        className={`gi-shop-sidebar col-lg-3 col-md-12 m-t-991 ${
          ((order = -1), none)
        }`}
      >
        <div id="shop_sidebar">
          <div className="gi-sidebar-wrap">
            {/* <!-- Sidebar Category Block --> */}
            <div className="gi-sidebar-block">
              <div
                style={{ display: "flex", justifyContent: "space-evenly" }}
                className="gi-sb-title"
              >
                <h3 className="gi-sidebar-title">Danh Mục</h3>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleDropdown("category")}
                >
                  <GoChevronDown />
                </div>
              </div>
              <Collapse
                in={isOpen.category}
              >
                <div
                  style={{ display: isOpen.category ? "block" : "none" }}
                  className={`gi-cat-sub-dropdown gi-sb-block-content height-transition-1s-ease`}
                >
                  <ul>
                    {categories.map((category) => (
                      <li key={category._id}>
                        <div className="gi-sidebar-block-item">
                          <input
                            checked={selectedCategory?.includes(category._id)}
                            onChange={() => handleCategoryChange(category._id)}
                            type="checkbox"
                          />
                          <Link href={`/shop?categoryId=${category._id}`}>
                            <span>
                              <img 
                                src={category.image_url} 
                                alt={category.name}
                                style={{ width: '20px', height: '20px', marginRight: '8px' }}
                              />
                              {category.name}
                            </span>
                          </Link>
                          <span className="checked"></span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Collapse>
            </div>
            {/* <!-- Sidebar Price Block --> */}
            <div className="gi-sidebar-block">
              <div
                style={{ display: "flex", justifyContent: "space-evenly" }}
                className="gi-sb-title"
              >
                <h3 className="gi-sidebar-title">Giá</h3>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleDropdown("price")}
                >
                  <GoChevronDown />
                </div>
              </div>
              <Collapse
                in={isOpen.price}
                
              >
                <div
                  style={{ display: isOpen.price ? "block" : "none" }}
                  className="gi-sb-block-content gi-price-range-slider es-price-slider height-transition-1s-ease"
                >
                  <PriceRangeSlider
                    min={min}
                    max={max}
                    onPriceChange={handlePriceChange}
                  />
                </div>
              </Collapse>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarArea;
