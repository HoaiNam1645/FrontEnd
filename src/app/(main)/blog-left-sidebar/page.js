import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import { Row } from 'react-bootstrap'
import NewsBlogPage from '@/components/blog-sidebar/NewsBlogPage'

const BlogLeftSidebar = () => {
    return (
        <>
            <Breadcrumb title={"Tin Tức"} />
            <section className="gi-blog padding-tb-40">
                <div className="container">
                    <Row>
                        <NewsBlogPage
                            order={"order-lg-last order-md-first"}
                            lg={8}
                            md={6}
                        />
                    </Row>
                </div>
            </section>
        </>
    )
}

export default BlogLeftSidebar
