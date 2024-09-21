import "react-toastify/dist/ReactToastify.css";
import "./assets/bootstrap/css/bootstrap.min.css";
import './assets/css/all.min.css';
import "./assets/css/animate.css";
import "./assets/css/magnific-popup.css";
import "./assets/css/main.css";
import "./assets/css/meanmenu.min.css";
import "./assets/css/owl.carousel.css";
import "./assets/css/responsive.css";

import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { useEffect } from "react";
import { connect } from 'react-redux';
import { check_continuous_auth } from "./actions/auth";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import ForgetPasswordConfirm from "./pages/ForgetPasswordConfirm";
import ForgetPasswordStart from "./pages/ForgetPasswordStart";
import HomePage from './pages/HomePage';
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import PackageCart from "./pages/PackageCart";
import Registration from "./pages/Registration";
import RegistrationDeliveryMan from "./pages/RegistrationDeliveryMan";
import RegistrationType from "./pages/RegistrationType";
import SellerPackageDashboard from "./pages/SellerPackageDashboard";
import SellerProductDashboard from "./pages/SellerProductDashboard";
import Shop from "./pages/Shop";
import SinglePackage from "./pages/SinglePackage";
import SinglePackageBuild from "./pages/SinglePackageBuild";
import SingleProduct from "./pages/SingleProduct";
import SellerType from "./pages/SellerType";
import SellerOrder from "./pages/SellerOrder";
import SellerPackageOrders from "./pages/SellerPackageOrders";
import DeliveryType from "./pages/DeliveryType";
import DeliveryFindProducts from "./pages/DeliveryFindProducts";
import DeliveryFindPackages from "./pages/DeliveryFindPackages";
import DeliveryAcceptProducts from "./pages/DeliveryAcceptProducts";
import DeliveryAcceptPackages from "./pages/DeliveryAcceptPackage";
import DeliveryDeliverProduct from "./pages/DeliveryDeliverProduct";
import DeliveryDeliverPackage from "./pages/DeliveryDeliverPackage";

function App({ check_continuous_auth }) {
  const location = useLocation();
  useEffect(() => {
    check_continuous_auth();
  }, [check_continuous_auth]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div>
      <Header />
      <Routes>
        <Route exact path='/single-package-build/:id' element={<SinglePackageBuild />} />
        <Route exact path='/single-package/:id' element={<SinglePackage />} />
        <Route exact path='/single-product/:id' element={<SingleProduct />} />
        <Route exact path='/contact' element={<Contact />} />
        <Route exact path='/orders' element={<Orders />} />

        <Route exact path='/about' element={<About />} />
        <Route exact path='/checkout' element={<Checkout />} />
        <Route exact path='/cart' element={<Cart />} />
        <Route exact path='/package-cart/:id' element={<PackageCart />} />

        <Route exact path='/seller-package-order' element={<SellerPackageOrders />} />
        <Route exact path='/seller-order' element={<SellerOrder />} />
        <Route exact path='/seller-product-dashboard' element={<SellerProductDashboard />} />
        <Route exact path='/seller-package-dashboard' element={<SellerPackageDashboard />} />
        <Route exact path='/seller-dashboard' element={<SellerType />} />

        <Route exact path='/delivery-dashboard' element={<DeliveryType />} />
        <Route exact path='/delivery-find-products' element={<DeliveryFindProducts />} />
        <Route exact path='/delivery-find-packages' element={<DeliveryFindPackages />} />
        <Route exact path='/delivery-product-accept' element={<DeliveryAcceptProducts />} />
        <Route exact path='/delivery-package-accept' element={<DeliveryAcceptPackages />} />
        <Route exact path='/delivery-product-deliver' element={<DeliveryDeliverProduct />} />
        <Route exact path='/delivery-package-deliver' element={<DeliveryDeliverPackage />} />

        <Route exact path='/shop' element={<Shop />} />
        <Route exact path='/forget-password-confirm' element={<ForgetPasswordConfirm />} />
        <Route exact path='/forget-password-start' element={<ForgetPasswordStart />} />
        <Route exact path='/registration-delivery-man' element={<RegistrationDeliveryMan />} />
        <Route exact path='/registration' element={<Registration />} />
        <Route exact path='/select-registration-type' element={<RegistrationType />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/' element={<HomePage />} />
      </Routes>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default connect(null, { check_continuous_auth })(App);
