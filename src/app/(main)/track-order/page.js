import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import TrackOrder from '@/components/track-order/TrackOrder'

const page = () => {
    return (
        <>
            <Breadcrumb title={"Đơn Hàng Của Tôi"} />
            <TrackOrder />
        </>
    )
}

export default page
