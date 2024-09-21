import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook from react-router-dom

const DeliveryType = () => {
    const navigate = useNavigate();
    return (
        <>
            <div class="breadcrumb-section breadcrumb-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="breadcrumb-text">
                                <p>Manage your delivery </p>
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
                                                navigate('/delivery-find-products');
                                            }} className='create-post-submit-btn'>
                                                <span>
                                                    Find Products Delivery
                                                </span>
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="card single-accordion">
                                        <div className="card-header" id="headingOne">

                                            <h5 className='create-post-submit-btn' onClick={() => {
                                                navigate('/delivery-find-packages');
                                            }}>
                                                <span>
                                                    Find Packages Delivery
                                                </span>
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="card single-accordion">
                                        <div className="card-header" id="headingOne">

                                            <h5 className='create-post-submit-btn' onClick={() => {
                                                navigate('/delivery-product-accept');
                                            }}>
                                                <span>
                                                    Collect Product From Seller
                                                </span>
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="card single-accordion">
                                        <div className="card-header" id="headingOne">

                                            <h5 className='create-post-submit-btn' onClick={() => {
                                                navigate('/delivery-package-accept');
                                            }}>
                                                <span>
                                                    Collect Package From Seller
                                                </span>
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="card single-accordion">
                                        <div className="card-header" id="headingOne">

                                            <h5 className='create-post-submit-btn' onClick={() => {
                                                navigate('/delivery-product-deliver');
                                            }}>
                                                <span>
                                                    Deliver Product to Customer
                                                </span>
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="card single-accordion">
                                        <div className="card-header" id="headingOne">

                                            <h5 className='create-post-submit-btn' onClick={() => {
                                                navigate('/delivery-package-deliver');
                                            }}>
                                                <span>
                                                    Deliver Package to Customer
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

export default DeliveryType;