import React from 'react';
import productImage from '../assets/img/products/product-img-1.png';
const SinglePackageBuild = () => {
    return (
        <>
            <div class="breadcrumb-section breadcrumb-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="breadcrumb-text">
                                <p>Fresh and Organic</p>
                                <h1>Select Items for Your</h1>
                                <h1> Biriyani Package</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cart-section mt-150 mb-150">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 col-md-12">
                            <div class="cart-table-wrap">
                                <table class="cart-table">
                                    <thead class="cart-table-head">
                                        <tr class="table-head-row">
                                            <th class="product-remove"></th>
                                            <th class="product-image">Product Image</th>
                                            <th class="product-name">Name</th>
                                            <th class="product-price">Price</th>
                                            <th class="product-quantity">Quantity</th>
                                            <th class="product-total">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="table-body-row">
                                            <td class="product-remove"><a href="#"><i class="far fa-window-close"></i></a></td>
                                            <td class="product-image"><img src={productImage} alt="" />
                                            </td>
                                            <td class="product-name">Chicken Curry</td>
                                            <td class="product-price">85 tk</td>
                                            <td class="product-quantity"><input type="number" placeholder="0" /></td>
                                            <td class="product-total">1</td>
                                        </tr>
                                        <tr class="table-body-row">
                                            <td class="product-remove"><a href="#"><i class="far fa-window-close"></i></a></td>
                                            <td class="product-image"><img src={productImage} alt="" />
                                            </td>
                                            <td class="product-name">Dul</td>
                                            <td class="product-price">70 tk</td>
                                            <td class="product-quantity"><input type="number" placeholder="0" /></td>
                                            <td class="product-total">1</td>
                                        </tr>

                                    </tbody>

                                </table>
                            </div>
                        </div>

                        <div class="col-lg-4">
                            <div class="total-section">
                                <table class="total-table">
                                    <thead class="total-table-head">
                                        <tr class="table-total-row">
                                            <th>Total</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="total-data">
                                            <td><strong>Subtotal: </strong></td>
                                            <td>155</td>
                                        </tr>
                                        <tr class="total-data">
                                            <td><strong>Shipping: </strong></td>
                                            <td>45 tk</td>
                                        </tr>
                                        <tr class="total-data">
                                            <td><strong>Total: </strong></td>
                                            <td>200 tk</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="cart-buttons">

                                    <a href="checkout.html" class="boxed-btn black">Check Out</a>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SinglePackageBuild;