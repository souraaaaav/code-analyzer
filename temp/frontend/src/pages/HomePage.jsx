import React from 'react';
import { Link } from 'react-router-dom';
import advertise from '../assets/img/a.jpg';
import CountdownTimer from '../components/CountdownTimer/CountdownTimer';
import Loader from '../components/Loader/Loader';
import useLoading from '../hook/customHook';
const HomePage = () => {
    const endDate = '2024-04-01T00:00:00Z';
    const isLoading = useLoading();

    return (
        <div>
            {isLoading && <Loader />}
            <div class="hero-area hero-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-9 offset-lg-2 text-center">
                            <div class="hero-text">
                                <div class="hero-text-tablecell">
                                    <p class="subtitle">Buy what you want</p>
                                    <h1>Delicious Food Items</h1>
                                    <div class="hero-btns">
                                        <Link to="/login" class="boxed-btn">Log In</Link>
                                        <Link to="/select-registration-type" class="bordered-btn">Create Account</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section class="cart-banner pt-100 pb-100">
                <div class="container">
                    <div class="row clearfix">

                        <div class="image-column col-lg-6">
                            <div class="image">
                                <div class="price-box">
                                    <div class="inner-price">
                                        <span class="price">
                                            <strong>30%</strong> <br /> off per kg
                                        </span>
                                    </div>
                                </div>
                                <img src={advertise} alt="" />
                            </div>
                        </div>

                        <div class="content-column col-lg-6">
                            <h3><span class="orange-text">Deal</span> of the month</h3>
                            <h4>Hikan Strwaberry</h4>
                            <div class="text">Quisquam minus maiores repudiandae nobis, minima saepe id, fugit ullam similique!
                                Beatae, minima quisquam molestias facere ea. Perspiciatis unde omnis iste natus error sit
                                voluptatem accusant</div>

                            <div className="time-counter">
                                <CountdownTimer endDate={endDate} />
                            </div>
                            <Link to="/shop" class="cart-btn mt-3"> Shop Now</Link>
                        </div>
                    </div>
                </div>
            </section>
            <div class="list-section pt-80 pb-80">
                <div class="container">

                    <div class="row">
                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="section-title">
                                <h3><span class="orange-text">We</span> Provide</h3>

                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
                            <div class="list-box d-flex align-items-center">
                                <div class="list-icon">
                                    <i class="fas fa-shipping-fast"></i>
                                </div>
                                <div class="content">
                                    <h3>Free Shipping</h3>
                                    <p>When order over $75</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
                            <div class="list-box d-flex align-items-center">
                                <div class="list-icon">
                                    <i class="fas fa-phone-volume"></i>
                                </div>
                                <div class="content">
                                    <h3>24/7 Support</h3>
                                    <p>Get support all day</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6">
                            <div class="list-box d-flex justify-content-start align-items-center">
                                <div class="list-icon">
                                    <i class="fas fa-sync"></i>
                                </div>
                                <div class="content">
                                    <h3>Refund</h3>
                                    <p>Get refund within 3 days!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <section class="shop-banner">
                <div class="container">
                    <h3>December sale is on! <br /> with big <span class="orange-text">Discount...</span></h3>
                    <div class="sale-percent"><span>Sale! <br /> Upto</span>50% <span>off</span></div>
                    <Link to="/shop" class="cart-btn mt-3"> Shop Now</Link>

                </div>
            </section>
        </div>
    );
};

export default HomePage;