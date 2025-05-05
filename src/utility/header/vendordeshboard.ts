interface vendor {
  name: string;
  href: string;
  slug: string;
}

const vendordeshboard: vendor[] = [
  {
    name: "Thông tin cá nhân",
    href: "/user-profile",
    slug: "user-profile"
  },
  {
    name: "Lịch sử mua hàng",
    href: "/user-history",
    slug: "user-history"
  },
  {
    name: "Bảng điều khiển",
    href: "/vendor-dashboard",
    slug: "vendor-dashboard"
  },
  {
    name: "Cài đặt",
    href: "/vendor-setting",
    slug: "vendor-setting"
  },
  {
    name: "Tải lên sản phẩm",
    href: "/vendor-upload",
    slug: "vendor-upload"
  },
  {
    name: "Danh sách cửa hàng",
    href: "/vendor-list-2",
    slug: "vendor-list-2"
  },
  {
    name: "Giỏ hàng",
    href: "/cart",
    slug: "cart"
  },
  {
    name: "Thanh toán",
    href: "/checkout",
    slug: "checkout"
  },
  {
    name: "Theo dõi đơn hàng",
    href: "/track-order",
    slug: "track-order"
  },
  {
    name: "Hóa đơn",
    href: "/user-invoice",
    slug: "user-invoice"
  },
];

export default vendordeshboard;
