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
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
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
      dispatch(setSortOption(event.target.value));
      setCurrentPage(1);
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
          <div className="gi-pro-list-top d-flex">
            <div className="col-md-6 gi-grid-list">
              <div className="gi-gl-btn">
                <button
                  className={`grid-btn btn-grid-50 ${
                    !isGridView ? "active" : ""
                  }`}
                  onClick={() => toggleView(false)}
                >
                  <i className="fi fi-rr-apps"></i>
                </button>
                <button
                  className={`grid-btn btn-list-50 ${
                    isGridView ? "active" : ""
                  }`}
                  onClick={() => toggleView(true)}
                >
                  <i className="fi fi-rr-list"></i>
                </button>
              </div>
            </div>
            <div className="col-md-6 gi-sort-select">
              <div className="gi-select-inner">
                <select
                  name="gi-select"
                  id="gi-select"
                  onChange={handleSortChange}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Sắp xếp theo
                  </option>
                  <option value="1">Vị trí</option>
                  <option value="2">Liên quan</option>
                  <option value="3">Tên, A đến Z</option>
                  <option value="4">Tên, Z đến A</option>
                  <option value="5">Giá, thấp đến cao</option>
                  <option value="6">Giá, cao đến thấp</option>
                </select>
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
