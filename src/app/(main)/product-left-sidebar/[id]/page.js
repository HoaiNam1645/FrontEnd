"use client";

import { Row } from 'react-bootstrap'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import ProductPage from '@/components/product-page/ProductPage'
import RelatedProduct from '@/components/product-page/related-product/RelatedProduct'
import { useEffect, useState } from 'react'
import { productService } from '@/services/productService'
import Spinner from '@/components/button/Spinner'
import { use } from 'react'
import { productsApi } from '@/utils/api'

const ProductDetailPage = ({ params }) => {
  // Unwrap params with React.use
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;
  
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        // Sử dụng API mới có thông tin reviews
        const response = await productsApi.getProductById(productId);
        if (response.data && response.data.success) {
          setProduct(response.data.data)
          // Lưu reviews nếu có
          if (response.data.reviews) {
            setReviews(response.data.reviews)
          }
        } else {
          throw new Error('Không thể tải thông tin sản phẩm')
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Không thể tải thông tin sản phẩm')
        setLoading(false)
      }
    }

    if (productId) {
      fetchProductData()
    }
  }, [productId])

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner />
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <p className="text-danger">{error}</p>
      </div>
    )
  }

  return (
    <>
      <Breadcrumb title={product ? product.name : "Chi tiết sản phẩm"} />
      <section className="gi-single-product padding-tb-40">
        <div className="container">
          <Row>
            <ProductPage
              productData={product}
              reviews={reviews}
            />
          </Row>
        </div>
      </section>
      <RelatedProduct />
    </>
  )
}

export default ProductDetailPage 