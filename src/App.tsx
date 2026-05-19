import { Routes, Route } from "react-router-dom";
import { SiteLayout } from "./components/SiteLayout";
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

export default function App() {
  return (
    <Routes>
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
  );
}
