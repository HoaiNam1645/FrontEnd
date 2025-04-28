import { Row } from 'react-bootstrap'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import NewsDetail from '@/components/blog-detail/NewsDetail'

const BlogDetailLeftSidebar = () => {
    return (
        <>
            <Breadcrumb title={"Chi Tiết Tin Tức"} />
            <section className="gi-blog padding-tb-40">
                <div className="container">
                    <Row>
                        <NewsDetail order={"order-lg-last order-md-first"} />
                    </Row>
                </div>
            </section>
        </>
    )
}

export default BlogDetailLeftSidebar
