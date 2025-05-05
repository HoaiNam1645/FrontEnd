import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import UserProfile from '@/components/user-profile/UserProfile'

const page = () => {
    return (
        <>
            <Breadcrumb title={"Thông tin cá nhân"} />
            <UserProfile />
        </>
    )
}

export default page
