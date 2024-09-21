import React from 'react';
import Loader from '../components/Loader/Loader';
import useLoading from '../hook/customHook';

const About = () => {
    const isLoading = useLoading();

    return (
        <>
            {isLoading && <Loader />}

            <div class="breadcrumb-section breadcrumb-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="breadcrumb-text">
                                <p>We sale fresh items</p>
                                <h1>About Us</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="feature-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-7">
                            <div class="featured-text">
                                <h2 class="pb-3">Why <span class="orange-text">Labonno's Store</span></h2>
                                <div class="row">
                                    <div class="col-lg-6 col-md-6 mb-4 mb-md-5">
                                        <div class="list-box d-flex">
                                            <div class="list-icon">
                                                <i class="fas fa-shipping-fast"></i>
                                            </div>
                                            <div class="content">
                                                <h3>Home Delivery</h3>
                                                <p>Enjoy the convenience of home delivery with Labonno's Store. Get your
                                                    favorite items delivered right to your doorstep, saving you time and hassle.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6 mb-5 mb-md-5">
                                        <div class="list-box d-flex">
                                            <div class="list-icon">
                                                <i class="fas fa-money-bill-alt"></i>
                                            </div>
                                            <div class="content">
                                                <h3>Best Price</h3>
                                                <p>At Labonno's Store, we offer the best prices for top-quality products. Shop
                                                    with confidence knowing you're getting great value for your money.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6 mb-5 mb-md-5">
                                        <div class="list-box d-flex">
                                            <div class="list-icon">
                                                <i class="fas fa-briefcase"></i>
                                            </div>
                                            <div class="content">
                                                <h3>Custom Box</h3>
                                                <p>Create your own custom box with Labonno's Store. Select your favorite items
                                                    and build a personalized box tailored to your preferences.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6">
                                        <div class="list-box d-flex">
                                            <div class="list-icon">
                                                <i class="fas fa-sync-alt"></i>
                                            </div>
                                            <div class="content">
                                                <h3>Quick Refund</h3>
                                                <p>Experience hassle-free returns and quick refunds with Labonno's Store. If
                                                    you're not satisfied with your purchase, we'll make it right.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;