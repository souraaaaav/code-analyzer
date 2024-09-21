import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";
import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {useNavigate} from 'react-router-dom';
import {toast} from "react-toastify";
import Loader from '../components/Loader/Loader';
import axios from '../helper/axios-helper.js';
import {clientId} from "../helper/paypal.js";
import useLoading from '../hook/customHook';
import bkashImage from '../assets/img/bkash.png'
const Checkout = () => {

    const isLoading = useLoading();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const storeData = useSelector(state => state.auth);
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(45);
    const [total, setTotal] = useState(0);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [bill, setBill] = useState('');

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };

    const handleBillChange = (e) => {
        setBill(e.target.value);
    };


    useEffect(() => {
        if (storeData && storeData?.user) {
            const cartData = localStorage.getItem(storeData.user.email);

            if (cartData) {
                const parsedCart = JSON.parse(cartData);
                const items = Object.values(parsedCart);
                setCartItems(items);
            }
        }
    }, [storeData]);
    useEffect(() => {
        const newSubtotal = cartItems.reduce((total, item) => {
            return total + item.count * parseFloat(item.product.price);
        }, 0);
        setSubtotal(newSubtotal);
    }, [cartItems]);

    useEffect(() => {
        const newTotal = subtotal + shippingCost;
        setTotal(newTotal);
    }, [subtotal, shippingCost]);


    const handleSubmit = async (payment_id, cod = false) => {
        setLoading(true);
        const orderData = {
            name: name,
            address: address,
            phone: phone,
            bill: bill,
            payment_id: payment_id,
            total_price: total,
            cod: cod,
            cart_items: cartItems.map(item => ({
                product_id: item.product.id,
                quantity: item.count
            }))
        };


        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${storeData.token}`
            }
        };
        axios.post('/create_order/', orderData, config)
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Successfully placed the order!!!");
                    localStorage.removeItem(storeData.user.email);
                    setLoading(false);

                    navigate('/orders');
                }
            })
            .catch(err => {
                setLoading(false);

                toast.error("Something went wrong!!!");
                console.log("error", err);
            });
    };
    const generatePaymentId = () => {
        const timestamp = Date.now().toString();
        const randomString = Math.random().toString(36).substring(2, 15);
        const paymentId = timestamp + randomString;
        return paymentId;
    };
    return (
        <>
            {(isLoading || loading) && <Loader/>}

            <div class="breadcrumb-section breadcrumb-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="breadcrumb-text">
                                <p>Fresh and Organic</p>
                                <h1>Check Out Product</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="checkout-section mt-150 mb-150">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8">
                            <div class="checkout-accordion-wrap">
                                <div class="accordion" id="accordionExample">
                                    <div class="card single-accordion">
                                        <div class="card-header" id="headingOne">
                                            <h5 class="mb-0">
                                                <button class="btn btn-link" type="button" data-toggle="collapse"
                                                        data-target="#collapseOne" aria-expanded="true"
                                                        aria-controls="collapseOne">
                                                    Billing & Shipping Address
                                                </button>
                                            </h5>
                                        </div>

                                        <div id="collapseOne" class="collapse show" aria-labelledby="headingOne"
                                             data-parent="#accordionExample">
                                            <div class="card-body">
                                                <div class="billing-address-form">
                                                    <form>
                                                        <p>
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                placeholder="Name"
                                                                value={name}
                                                                onChange={handleNameChange}
                                                                required
                                                            />
                                                        </p>
                                                        <p>
                                                            <input
                                                                type="text"
                                                                name="address"
                                                                placeholder="Address"
                                                                value={address}
                                                                onChange={handleAddressChange}
                                                                required
                                                            />
                                                        </p>
                                                        <p>
                                                            <input
                                                                type="tel"
                                                                name="phone"
                                                                placeholder="Phone"
                                                                value={phone}
                                                                onChange={handlePhoneChange}
                                                                required
                                                            />
                                                        </p>
                                                        <p>
                                                            <textarea
                                                                name="bill"
                                                                id="bill"
                                                                cols="30"
                                                                rows="10"
                                                                placeholder="Say Something"
                                                                value={bill}
                                                                onChange={handleBillChange}
                                                            ></textarea>
                                                        </p>
                                                    </form>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="card single-accordion">
                                        <div class="card-header" id="headingThree">
                                            <h5 class="mb-0">
                                                <button class="btn btn-link collapsed" type="button"
                                                        data-toggle="collapse"
                                                        data-target="#collapseThree" aria-expanded="false"
                                                        aria-controls="collapseThree">
                                                    Confirm Payment & Place Order
                                                </button>
                                            </h5>
                                        </div>
                                        <div id="collapseThree" class="collapse" aria-labelledby="headingThree"
                                             data-parent="#accordionExample">
                                            <div className="card-body">
                                                <div className="card-details">
                                                    {total !== 0 &&
                                                        <PayPalScriptProvider options={{"client-id": clientId}}>
                                                            <PayPalButtons
                                                                forceReRender={[name, address, phone, bill, total]}
                                                                createOrder={(data, actions) => {
                                                                    return actions.order.create({
                                                                        purchase_units: [
                                                                            {
                                                                                amount: {
                                                                                    value: total,
                                                                                },
                                                                            },
                                                                        ],

                                                                    });
                                                                }}

                                                                onApprove={async (data, actions) => {
                                                                    try {
                                                                        const details = await actions.order.capture();

                                                                        await handleSubmit(details.purchase_units[0].payments.captures[0].id);

                                                                    } catch (error) {

                                                                        toast.error("Something went wrong!!!");
                                                                        console.log(error);
                                                                    }
                                                                }}

                                                            />
                                                        </PayPalScriptProvider>
                                                    }

                                                </div>
                                                <div className="card single-accordion">
                                                    <div className="card-header" id="headingOne">

                                                        <h5 className='create-post-submit-btn'
                                                            style={{background: '#E2136E', textAlign: 'center'}}
                                                            onClick={() => handleSubmit(generatePaymentId())}>
                                                <span>
                                                   Bkash
                                                </span>
                                                            <img src={bkashImage} height="25px"/>

                                                        </h5>

                                                    </div>
                                                </div>

                                                <div className="card single-accordion">
                                                    <div className="card-header" id="headingOne">

                                                        <h5 className='create-post-submit-btn'
                                                            style={{background: '#1f8768', textAlign: 'center'}}
                                                            onClick={() => handleSubmit(generatePaymentId(), true)}>
                                                <span>
                                                    Cash on Delivery
                                                </span>
                                                            <i className="fas fa-money-bill"
                                                               style={{marginLeft: '10px'}}></i>

                                                        </h5>

                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="col-lg-4">
                            <div class="order-details-wrap">
                                <table class="order-details">
                                    <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Count</th>
                                        <th>Price</th>
                                    </tr>
                                    </thead>
                                    <tbody class="order-details-body">
                                    {Object.keys(cartItems).map((key) => {
                                        const item = cartItems[key];
                                        return (
                                            <tr key={key} className="order-details-row">
                                                <td>{item.product.name}</td>
                                                <td style={{textAlign: 'center'}}>{item.count}</td>
                                                <td>{(item.count * parseFloat(item.product.price)).toFixed(2)} tk</td>
                                            </tr>
                                        );
                                    })}

                                    </tbody>
                                    <tbody class="checkout-details">

                                    <tr>
                                        <td>Shipping</td>
                                        <td></td>

                                        <td>45 tk</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Total: </strong></td>
                                        <td></td>

                                        <td>{total.toFixed(2)} tk</td>
                                    </tr>
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

export default Checkout;