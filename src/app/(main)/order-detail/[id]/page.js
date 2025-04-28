import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import OrderDetailPage from '@/pages/order-detail'

export default function OrderDetail({ params }) {
  return (
    <>
      <Breadcrumb title={"Chi Tiết Đơn Hàng"} />
      <OrderDetailPage orderId={params.id} />
    </>
  )
} 