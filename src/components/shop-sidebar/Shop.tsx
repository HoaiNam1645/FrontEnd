"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ShopProductItem from "../product-item/ShopProductItem";
import { Col, Row } from "react-bootstrap";
import SidebarArea from "./sidebar-area/SidebarArea";
import Spinner from "../button/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  setRange,
  setSearchTerm,
  setSelectedCategory,
  setSelectedColor,
  setSelectedTags,
  setSelectedWeight,
  setSortOption,
} from "@/store/reducers/filterReducer";
import Paginantion from "../paginantion/Paginantion";
import { productService, Product } from "@/services/productService";
import { useSearchParams } from "next/navigation";

// API domain for images - to be used across the application
export const API_DOMAIN = "http://localhost:5001";

const Shop = ({
  xl = 4,
  lg = 12,
  order = "",
  list = "",
  className = "padding-tb-40",
  isList = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isGridView, setIsGridView] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("categoryId");
  const {
    selectedCategory,
    selectedWeight,
    sortOption,
    minPrice,
    maxPrice,
    range,
    searchTerm,
    selectedColor,
    selectedTags,
  } = useSelector((state: RootState) => state.filter);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (err) {
        setError("Không thể tải sản phẩm");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to fetch products with sort order
  const fetchSortedProducts = async (sortOrder: string) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/products/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sort: sortOrder }),
      });
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Error fetching sorted products:', error);
      setError("Không thể tải sản phẩm đã sắp xếp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId && categoryId !== "67e666ae0a4c7a283acd2a18") {
      dispatch(setSelectedCategory([categoryId]));
    } else if (categoryId && categoryId === "67e666ae0a4c7a283acd2a18") {
      dispatch(setSelectedCategory([]));
    } else {
      dispatch(setSelectedCategory([]));
    }
  }, [categoryId, dispatch]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Lọc theo tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo giá
    if (minPrice && maxPrice) {
      filtered = filtered.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
      );
    }

    // Lọc theo danh mục (chỉ khi có categoryId và không phải là categoryId đặc biệt)
    if (categoryId && categoryId !== "67e666ae0a4c7a283acd2a18") {
      filtered = filtered.filter(product =>
        product.categoryId === categoryId
      );
    } else if (selectedCategory.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategory.includes(product.categoryId)
      );
    }

    // Sắp xếp
    if (sortOption) {
      switch (sortOption) {
        case "1": // Position
          break;
        case "2": // Relevance
          break;
        case "3": // Name, A to Z
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "4": // Name, Z to A
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "5": // Price, low to high
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "6": // Price, high to low
          filtered.sort((a, b) => b.price - a.price);
          break;
      }
    }

    return filtered;
  }, [products, searchTerm, minPrice, maxPrice, selectedCategory, sortOption, categoryId]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const toggleView = (isGrid: boolean) => {
    setIsGridView(isGrid);
  };

  useEffect(() => {
    dispatch(setSearchTerm(""));
    setCurrentPage(1);
    setLocalSearchTerm("");
  }, [dispatch]);

  const handlePriceChange = useCallback(
    (min: number, max: number) => {
      dispatch(setRange({ min, max }));
      setCurrentPage(1);
    },
    [dispatch]
  );

  const handleSortChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const sortValue = event.target.value;
      dispatch(setSortOption(sortValue));
      setCurrentPage(1);
      
      // Directly use the selected value as the sort parameter
      fetchSortedProducts(sortValue);
    },
    [dispatch]
  );

  const handleCategoryChange = (category: string) => {
    const updatedCategory = selectedCategory.includes(category)
      ? selectedCategory.filter((cat) => cat !== category)
      : [...selectedCategory, category];
    dispatch(setSelectedCategory(updatedCategory));
    setCurrentPage(1);
  };

  const handleWeightChange = (weight: string) => {
    const updatedweight = selectedWeight.includes(weight)
      ? selectedWeight.filter((wet) => wet !== weight)
      : [weight];
    dispatch(setSelectedWeight(updatedweight));
    setCurrentPage(1);
  };

  const handleColorChange = (color: string) => {
    const updatedcolor = selectedColor.includes(color)
      ? selectedColor.filter((clr) => clr !== color)
      : [...selectedColor, color];
    dispatch(setSelectedColor(updatedcolor));
    setCurrentPage(1);
  };

  const handleTagsChange = (tag: string) => {
    const updatedtag = selectedTags.includes(tag)
      ? selectedTags.filter((tg) => tg !== tag)
      : [...selectedTags, tag];
    dispatch(setSelectedTags(updatedtag));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle local search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchTerm(localSearchTerm));
    setCurrentPage(1);
  };

  if (error) return <div>{error}</div>;

  return (
    <>
      <Row className={className}>
        <Col
          lg={lg}
          md={12}
          className={`margin-b-30 gi-shop-rightside ${order}`}
        >
          {/* <!-- Shop Top Start --> */}
          <div className="gi-pro-list-top d-flex flex-wrap">
            <div className="col-md-6 col-12 gi-grid-list">
              <div className="gi-gl-btn">
                <button
                  className={`grid-btn btn-grid-50 ${
                    !isGridView ? "active" : ""
                  }`}
                  onClick={() => toggleView(false)}
                >
                  <i className="fi fi-rr-apps"></i>
                </button>
                
              </div>
            </div>
            <div className="col-md-6 col-12 d-flex align-items-center">
              {/* <!-- Sort Select --> */}
              <div className="col-md-6 col-6 gi-sort-select pe-0">
                <div className="gi-select-inner">
                  <select
                    name="gi-select"
                    id="gi-select"
                    onChange={handleSortChange}
                    defaultValue=""
                    style={{
                      height: '44px',
                      borderRadius: '30px 0 0 30px',
                      border: '1px solid #e0e0e0',
                      borderRight: 'none',
                      padding: '0 15px',
                      backgroundColor: '#f8f8f8',
                      fontSize: '14px',
                      width: '100%',
                      outline: 'none'
                    }}
                  >
                    <option value="" disabled>
                      Sắp xếp theo
                    </option>
                    <option value="ASC">Giá, thấp đến cao</option>
                    <option value="DESC">Giá, cao đến thấp</option>
                  </select>
                </div>
              </div>
              {/* <!-- Search input --> */}
              <div className="col-md-6 col-6 gi-search-area ps-0">
                <form onSubmit={handleSearchSubmit} className="gi-search-form">
                  <div className="gi-search-inner position-relative">
                    <input
                      type="text"
                      className="form-control gi-search-input"
                      placeholder="Tìm kiếm sản phẩm..."
                      value={localSearchTerm}
                      onChange={handleSearchInputChange}
                      style={{
                        borderRadius: '0 30px 30px 0',
                        padding: '10px 45px 10px 15px',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                        height: '44px',
                        width: '100%',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                    />
                    <button 
                      type="submit" 
                      className="search-submit-btn"
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        padding: '8px',
                        cursor: 'pointer',
                        color: '#666',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i className="fi fi-rr-search"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* <!-- Shop Top End --> */}

          {/* <!-- Shop content Start --> */}
          {loading ? (
            <Spinner />
          ) : (
            <div
              className={`shop-pro-content ${isGridView ? "list-view-50" : ""}`}
            >
              <div className={`shop-pro-inner ${list}`}>
                <Row>
                  {paginatedProducts.map((item: Product) => (
                    <ShopProductItem
                      isGridView={isGridView}
                      xl={xl}
                      data={item}
                      key={item._id}
                      isList={isList}
                    />
                  ))}
                </Row>
              </div>
              {/* <!-- Pagination Start --> */}
              {!paginatedProducts.length ? (
                <div
                  style={{ textAlign: "center" }}
                  className="gi-pro-content cart-pro-title"
                >
                  Không tìm thấy sản phẩm.
                </div>
              ) : (
                <div className="gi-pro-pagination">
                  <span>
                    Hiển thị {startIndex + 1}-
                    {Math.min(startIndex + itemsPerPage, filteredProducts.length)} trên{" "}
                    {filteredProducts.length} sản phẩm
                  </span>

                  <Paginantion
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}

              {/* <!-- Pagination End --> */}
            </div>
          )}

          {/* <!--Shop content End --> */}
        </Col>
        {/* <!-- Sidebar Area Start --> */}

        <SidebarArea
          handleCategoryChange={handleCategoryChange}
          handleWeightChange={handleWeightChange}
          handleColorChange={handleColorChange}
          handleTagsChange={handleTagsChange}
          min={minPrice}
          max={maxPrice}
          handlePriceChange={handlePriceChange}
          selectedWeight={selectedWeight}
          selectedCategory={selectedCategory}
          selectedColor={selectedColor}
          selectedTags={selectedTags}
          order={order}
        />
      </Row>
    </>
  );
};

export default Shop;
