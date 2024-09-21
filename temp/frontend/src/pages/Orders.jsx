import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader/Loader.jsx';
import Stepper from "../components/Stepper/Stepper";
import axios from '../helper/axios-helper.js';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [packageOrders, setPackageOrders] = useState([]);

    const [loading, setLoading] = useState(false);
    const storeData = useSelector(state => state.auth);

    const [searchTerm, setSearchTerm] = useState('');
    const [packageSearchTerm, setPackageSearchTerm] = useState('');

    useEffect(() => {
        if (storeData && storeData?.token) {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${storeData.token}`
                }
            };

            let url = '/orders/';
            if (searchTerm) {
                url += `?payment_id=${searchTerm}`;
            }

            axios.get(url, config)
                .then(response => {
                    console.log(response.data);
                    setOrders(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching orders:', error);
                    setLoading(false);
                });
        }
    }, [storeData, searchTerm]);
    useEffect(() => {
        if (storeData && storeData?.token) {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${storeData.token}`
                }
            };
            let url = '/package-orders/';
            if (packageSearchTerm) {
                url += `?payment_id=${packageSearchTerm}`;
            }

            axios.get(url, config)
                .then(response => {
                    console.log(response.data);

                    setPackageOrders(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching package orders:', error);
                    setLoading(false);
                });
        }
    }, [storeData, packageSearchTerm]);
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };
    return (
        <>
            {(loading) && <Loader />}
            <div class="breadcrumb-section breadcrumb-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="breadcrumb-text">
                                <p>Fresh and Organic</p>
                                <h1>Your Cart</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cart-section mt-100 mb-150">
                <div class="container-fluid">
                    {/* <div class="col-lg-8 offset-lg-2 text-center">
                        <div class="section-title">
                            <h3>Order ID <span class="orange-text">122-122-222-333</span></h3>
                        </div>
                    </div> */}
                    <div class="row">

                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="section-title">
                                <h3>Product Orders List<span class="orange-text"></span></h3>
                            </div>
                        </div>
                        <div class="col-md-12 mb-20">
                            <div class="product-filters">
                                <ul>
                                    <li>
                                        <i className="fas fa-search" style={{ marginRight: '10px' }}></i>
                                        <input
                                            type="text"
                                            placeholder="Filter by Payment ID"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ border: 'none', outline: 'none' }}
                                        />
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="total-section">
                                <table class="total-table">
                                    <thead class="total-table-head">
                                        <tr class="table-total-row">
                                            <th>Payment Id</th>
                                            <th>Order Placed Time</th>
                                            <th>Total Price</th>
                                            <th>Product Details</th>
                                            <th>Order Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders ? orders.map(order => (
                                            <tr key={order.id} className="total-data">
                                                <td><strong>{order.payment_id}</strong></td>
                                                <td>{formatDate(order.created_at)}</td>
                                                <td>{order.total_price}</td>
                                                <td>
                                                    <table class="total-table">
                                                        <thead class="total-table-head">
                                                            <tr class="table-total-row">
                                                                <th>Name</th>
                                                                <th>Price(per unit)</th>
                                                                <th>Quantity</th>
                                                                <th>Total Price</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {order.order_products.map((item, i) => (
                                                                <tr key={i} className="total-data">
                                                                    <td>{item.product.name}</td>
                                                                    <td>{item.product.price}</td>
                                                                    <td>{item.quantity}</td>
                                                                    <td> {parseInt(item.product.price) * item.quantity}</td>
                                                                </tr>
                                                            ))}

                                                        </tbody>
                                                    </table>
                                                </td>
                                                <td>
                                                    <Stepper currentStatus={order.status} />
                                                </td>
                                            </tr>
                                        )) : <tr className="total-data" ><td colSpan={4}>No Orders found!!!</td></tr>}

                                    </tbody>
                                </table>

                            </div>


                        </div>
                        <div class="col-lg-8 offset-lg-2 text-center mt-80">
                            <div class="section-title">
                                <h3>Package Orders List<span class="orange-text"></span></h3>
                            </div>
                        </div>
                        <div class="col-md-12 mb-20">
                            <div class="product-filters">
                                <ul>
                                    <li>
                                        <i className="fas fa-search" style={{ marginRight: '10px' }}></i>
                                        <input
                                            type="text"
                                            placeholder="Filter by Payment ID"
                                            value={packageSearchTerm}
                                            onChange={(e) => setPackageSearchTerm(e.target.value)}
                                            style={{ border: 'none', outline: 'none' }}
                                        />
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="total-section">
                                <table class="total-table">
                                    <thead class="total-table-head">
                                        <tr class="table-total-row">
                                            <th>Payment Id</th>

                                            <th>Package Name</th>
                                            <th>Order Placed Time</th>

                                            <th>Total Price</th>
                                            <th>Product Details</th>
                                            <th>Order Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {packageOrders ? packageOrders.map(order => (
                                            <tr key={order.id} className="total-data">
                                                <td><strong>{order.payment_id}</strong></td>
                                                <td>{order.package.name}</td>
                                                <td>{formatDate(order.created_at)}</td>

                                                <td>{order.total_price}</td>
                                                <td>
                                                    <table class="total-table">
                                                        <thead class="total-table-head">
                                                            <tr class="table-total-row">
                                                                <th>Name</th>
                                                                <th>Price(per unit)</th>
                                                                <th>Quantity</th>
                                                                <th>Total Price</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {order.package_order_products.map((item, i) => (
                                                                <tr key={i} className="total-data">
                                                                    <td>{item.product.name}</td>
                                                                    <td>{item.product.price}</td>
                                                                    <td>{item.quantity}</td>
                                                                    <td> {parseInt(item.product.price) * item.quantity}</td>

                                                                </tr>
                                                            ))}
                                                            <tr className="total-data">
                                                                <td>Shipping</td>
                                                                <td></td>
                                                                <td></td>
                                                                <td>45</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                                <td>
                                                    <Stepper currentStatus={order.status} />
                                                </td>
                                            </tr>
                                        )) : <tr className="total-data">
                                            <td colSpan={4}>No Orders found!!!</td>
                                        </tr>}

                                    </tbody>
                                </table>

                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Orders;