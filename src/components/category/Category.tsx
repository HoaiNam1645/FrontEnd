"use client";
import { Col, Row } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CategoryItem from "../product-item/CategoryItem";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../button/Spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface Category {
  _id: string;
  name: string;
  image_url: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Category = ({
  onSuccess = () => {},
  hasPaginate = false,
  onError = () => {},
  className = "padding-tb-40",
}) => {
  const { direction } = useSelector((state: RootState) => state.theme);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/categories/getAll');
        if (response.data.success) {
          setCategories(response.data.data);
          onSuccess();
        }
      } catch (err) {
        setError('Failed to load categories');
        onError();
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error) return <div>{error}</div>;
  if (loading) return <div><Spinner /></div>;

  const getData = () => {
    return categories;
  };

  return (
    <section className={`gi-category body-bg ${className}`}>
      <div className="container">
        <Row className="m-b-minus-15px">
          <Col xl={12}>
            <Swiper
              dir={direction == "RTL" ? "rtl" : "ltr"}
              loop={true}
              autoplay={{ delay: 1000 }}
              slidesPerView={5}
              spaceBetween={20}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                320: {
                  slidesPerView: 1,
                },
                425: {
                  slidesPerView: 2,
                },
                767: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
                1200: {
                  slidesPerView: 5,
                },
                1440: {
                  slidesPerView: 6,
                },
              }}
              className={`gi-category-block owl-carousel  ${direction == "RTL" ? "rtl" : "ltr"}`}
            >
              {getData().map((item: Category) => (
                <SwiperSlide
                  key={item._id}
                  className="gi-cat-box"
                >
                  <CategoryItem 
                    data={{
                      _id: item._id,
                      name: item.name,
                      image: item.image_url,
                      persantine: "0%",
                      item: "0"
                    }} 
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Category;
