"use client";
import { useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import StarRating from "../stars/StarRating";
import ProductTeb from "./product-teb/ProductTeb";
import { Col } from "react-bootstrap";
import SingleProductContent from "./single-product-content/SingleProductContent";
import useSWR from "swr";
import fetcher from "../fetcher-api/Fetcher";
import Spinner from "../button/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  setRange,
  setSelectedCategory,
  setSelectedColor,
  setSelectedTags,
  setSelectedWeight,
} from "@/store/reducers/filterReducer";
import { Product } from "@/services/productService";

interface ProductPageProps {
  order?: string;
  none?: string;
  lg?: number;
  onSuccess?: () => void;
  hasPaginate?: boolean;
  onError?: () => void;
  productData?: Product | null;
  reviews?: any[];
}

const ProductPage = ({
  order = "",
  none = "none",
  lg = 12,
  onSuccess = () => {},
  hasPaginate = false,
  onError = () => {},
  productData = null,
  reviews = [],
}: ProductPageProps) => {
  const dispatch = useDispatch();
  const {
    selectedCategory,
    selectedWeight,
    minPrice,
    maxPrice,
    selectedColor,
    selectedTags,
  } = useSelector((state: RootState) => state.filter);

  const { data, error } = useSWR("/api/moreitem", fetcher, {
    onSuccess,
    onError,
  });

  const handlePriceChange = useCallback(
    (min: number, max: number) => {
      dispatch(setRange({ min, max }));
    },
    [dispatch]
  );

  if (error) return <div>Không thể tải dữ liệu sản phẩm</div>;
  if (!data)
    return (
      <div>
        <Spinner />
      </div>
    );

  const handleCategoryChange = (category) => {
    const updatedCategory = selectedCategory.includes(category)
      ? selectedCategory.filter((cat) => cat !== category)
      : [...selectedCategory, category];
    dispatch(setSelectedCategory(updatedCategory));
  };

  const handleWeightChange = (weight) => {
    const updatedweight = selectedWeight.includes(weight)
      ? selectedWeight.filter((wet) => wet !== weight)
      : [...selectedWeight, weight];
    dispatch(setSelectedWeight(updatedweight));
  };

  const handleColorChange = (color) => {
    const updatedcolor = selectedColor.includes(color)
      ? selectedColor.filter((clr) => clr !== color)
      : [...selectedColor, color];
    dispatch(setSelectedColor(updatedcolor));
  };

  const handleTagsChange = (tag) => {
    const updatedtag = selectedTags.includes(tag)
      ? selectedTags.filter((tg) => tg !== tag)
      : [...selectedTags, tag];
    dispatch(setSelectedTags(updatedtag));
  };

  const getData = () => {
    if (hasPaginate) return data.data;
    else return data;
  };

  let filteredData = [...data];

  if (selectedCategory.length > 0) {
    filteredData = filteredData.filter((item) =>
      selectedCategory.includes(item.category)
    );
  }

  if (selectedWeight.length > 0) {
    filteredData = filteredData.filter((item) =>
      selectedWeight.includes(item.weight)
    );
  }

  if (selectedColor.length > 0) {
    filteredData = filteredData.filter((item) =>
      selectedColor.includes(item.Color)
    );
  }

  if (selectedTags.length > 0) {
    filteredData = filteredData.filter((item) =>
      selectedTags.includes(item.tags)
    );
  }

  return (
    <>
      <Col
        lg={12}
        md={12}
        className="gi-pro-rightside gi-common-rightside"
      >
        {/* <!-- Nội dung sản phẩm bắt đầu --> */}
        <div className="single-pro-block">
          <SingleProductContent productData={productData} />
        </div>
        {/* <!--Nội dung sản phẩm kết thúc -->
                    <!-- Thêm nhiều sản phẩm và nhận giảm giá bắt đầu --> */}
        {/* <div className="single-add-more m-tb-40">
          <Swiper
            loop={true}
            autoplay={{ delay: 1000 }}
            slidesPerView={3}
            spaceBetween={20}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              425: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1025: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
            style={{ overflow: "hidden" }}
            className="gi-add-more-slider owl-carousel"
          >
            {getData().map((item: any, index: number) => (
              <SwiperSlide key={index} className="add-more-item">
                <a href="" className="gi-btn-2">
                  +
                </a>
                <div className="add-more-img">
                  <img src={item.image} alt="sản phẩm" />
                </div>
                <div className="add-more-info">
                  <h5>{item.title}</h5>
                  <span className="gi-pro-rating">
                    <StarRating rating={item.rating} />
                  </span>
                  <span className="gi-price">
                    <span className="new-price">{item.newPrice.toLocaleString()}đ</span>
                    <span className="old-price">{item.oldPrice.toLocaleString()}đ</span>
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div> */}

        {/* <!-- Tab sản phẩm bắt đầu --> */}
        <ProductTeb productId={productData?._id || ''} reviews={reviews} />
        {/* <!-- Khu vực mô tả chi tiết sản phẩm kết thúc --> */}
      </Col>
    </>
  );
};

export default ProductPage;
