import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import SignIn from "./pages/SignIn";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import Membership from "./pages/Membership";
import CompanyTopic from "./pages/CompanyTopic";
import SupportTopic from "./pages/SupportTopic";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Routes location={location}>
        <Route path="/" element={<Index />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/account" element={<Account />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/company/:topic" element={<CompanyTopic />} />
        <Route path="/support/:topic" element={<SupportTopic />} />
      </Routes>
    </>
  );
}
