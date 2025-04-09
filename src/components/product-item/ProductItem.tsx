import { useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import ItemCard from "./ItemCard";
import { ProductContentType } from "../../types";
import Spinner from "../button/Spinner";
import { productService, Product } from "@/services/productService";

function ProductAll({
  url,
  onSuccess = () => {},
  hasPaginate = false,
  onError = () => {},
}: ProductContentType) {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await productService.getAllProducts();
        console.log('Products fetched in ProductItem:', productsData);
        setData(productsData || []);
        onSuccess(productsData);
      } catch (err) {
        console.error('Error fetching products in ProductItem:', err);
        setError("Không thể tải sản phẩm");
        onError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [url]);

  const handleClick = () => {
    setSelected(!selected);
  };

  if (error) return <div>Không thể tải sản phẩm</div>;
  if (loading) return <Spinner />;

  return (
    <>
      {data.map((item: Product, index: number) => (
        <Col
          key={item._id}
          md={4}
          className={`col-sm-6 gi-product-box gi-col-5 ${
            selected ? "active" : ""
          }`}
          onClick={handleClick}
        >
          <ItemCard data={item} />
        </Col>
      ))}
    </>
  );
}

export default ProductAll;
