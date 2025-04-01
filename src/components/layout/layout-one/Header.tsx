"use client";
import HeaderManu from "./header/HeaderManu";
import HeaderTwo from "./header/HeaderTwo";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import FeatureTools from "@/theme/ThemeSwitcher";

function Header() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.wishlist
  );
  return (
    <>
      {/* <Loader /> */}
      <header className="gi-header">
        <FeatureTools />
        <HeaderTwo cartItems={cartItems} wishlistItems={wishlistItems} />
        <HeaderManu />
      </header>
    </>
  );
}

export default Header;
