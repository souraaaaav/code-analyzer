import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook from react-router-dom

const SellerType = () => {
    const navigate = useNavigate();
    return (
        <>
            <div class="breadcrumb-section breadcrumb-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="breadcrumb-text">
                                <p>Manage your shop </p>
                                <h1>Select What to Do</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="checkout-section mt-100 mb-150">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-9 mx-auto text-center">
                            <div class="checkout-accordion-wrap">
                                <div className="accordion" id="accordionExample">

                                    <div className="card single-accordion">
                                        <div className="card-header" id="headingOne">

                                            <h5 onClick={() => {
                                                navigate('/seller-product-dashboard');
                                            }} className='create-post-submit-btn'>
                                                <span>
                                                    Manage Products
                                                </span>
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="card single-accordion">
                                        <div className="card-header" id="headingOne">

                                            <h5 className='create-post-submit-btn' onClick={() => {
                                                navigate('/seller-package-dashboard');
                                            }}>
                                                <span>
                                                    Manage Packages
                                                </span>
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="card single-accordion">
                                        <div className="card-header" id="headingOne">

                                            <h5 className='create-post-submit-btn' onClick={() => {
                                                navigate('/seller-order');
                                            }}>
                                                <span>
                                                    Manage Product Orders
                                                </span>
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="card single-accordion">
                                        <div className="card-header" id="headingOne">

                                            <h5 className='create-post-submit-btn' onClick={() => {
                                                navigate('/seller-package-order');
                                            }}>
                                                <span>
                                                    Manage Package Orders
                                                </span>
                                            </h5>
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

export default SellerType;