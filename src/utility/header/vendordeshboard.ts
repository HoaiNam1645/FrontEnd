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
];

export default vendordeshboard;
