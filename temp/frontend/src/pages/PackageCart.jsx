import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from "react-toastify";
import Loader from '../components/Loader/Loader';
import axios from '../helper/axios-helper.js';
import {clientId} from "../helper/paypal.js";
import useLoading from '../hook/customHook';
import bkashImage from '../assets/img/bkash.png'

const PackageCart = () => {
    const isLoading = useLoading();
    let {id} = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const storeData = useSelector(state => state.auth);
    const [packageInfo, setPackageInfo] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [checkout, setCheckOut] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [bill, setBill] = useState('');

    useEffect(() => {
        axios.get('/packages/' + id)
            .then(response => {
                console.log(response.data);
                const items = response.data.products;
                const itemsWithCount = items.map(item => ({
                    ...item,
                    count: 1
                }));
                setPackageInfo(response.data);
                setCartItems(itemsWithCount);
            })
            .catch(error => {
                console.error('Error fetching packages:', error);
            });
    }, [id]);
    const handleRemoveItem = (id) => {
        const updatedCartItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCartItems);
    };
    const handleChangeQuantity = (id, newCount) => {
        if (!isNaN(newCount) && newCount > 0) {
            const updatedCartItems = cartItems.map(item => {
                if (item.id === id) {
                    return {...item, count: newCount};
                }
                return item;
            });

            setCartItems(updatedCartItems);
        }
    };
    const subtotal = cartItems.reduce((total, item) => {
        return total + item.count * parseFloat(item.price);
    }, 0);

    const shippingCost = 45;

    const total = subtotal + shippingCost;

    const proceedToCheckout = () => {
        setLoading(true);
        setTimeout(() => {
            setCheckOut(true);
            setLoading(false);
        }, 1000);
    };
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
            package_order: id,
            cart_items: cartItems.map(item => ({
                product_id: item.id,
                quantity: item.count
            }))
        };


        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${storeData.token}`
            }
        };
        axios.post('/create_package_order/', orderData, config)
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
            {!checkout && <>
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
                                        {cartItems.map((item, index) => (
                                            <tr className="table-body-row" key={index}>
                                                <td className="product-remove">
                                                    <span onClick={() => handleRemoveItem(item.id)}><i
                                                        className="far fa-window-close"></i></span>
                                                </td>
                                                <td className="product-image">
                                                    <img src={item.image} alt={item.name}/>
                                                </td>
                                                <td className="product-name">{item.name}</td>
                                                <td className="product-price">{item.price} tk</td>
                                                <td className="product-quantity">
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        value={item.count}
                                                        min={1}
                                                        max={10}
                                                        onChange={(e) => handleChangeQuantity(item.id, parseInt(e.target.value, 10))}
                                                    />
                                                </td>
                                                <td className="product-total">{(item.count * parseFloat(item.price)).toFixed(2)} tk</td>
                                            </tr>
                                        ))}

                                        </tbody>

                                    </table>
                                </div>
                            </div>

                            <div class="col-lg-4">
                                <div class="total-section">
                                    <table className="total-table">
                                        <thead className="total-table-head">
                                        <tr className="table-total-row">
                                            <th>Total</th>
                                            <th>Price</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr className="total-data">
                                            <td><strong>Subtotal: </strong></td>
                                            <td>{subtotal.toFixed(2)} tk</td>
                                        </tr>
                                        <tr className="total-data">
                                            <td><strong>Shipping: </strong></td>
                                            <td>{shippingCost} tk</td>
                                        </tr>
                                        <tr className="total-data">
                                            <td><strong>Total: </strong></td>
                                            <td>{total.toFixed(2)} tk</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <div class="cart-buttons">

                                        <span onClick={proceedToCheckout} class="cart-btn">Check Out</span>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </>}
            {checkout && <>
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
                                                <div class="card-body">
                                                    <div class="card-details">
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
                                                                            console.log(details);
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
                                                    <td>{item.name}</td>
                                                    <td style={{textAlign: 'center'}}>{item.count}</td>
                                                    <td>{(item.count * parseFloat(item.price)).toFixed(2)} tk</td>
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
                                        <tr>
                                            <td><strong>Package: </strong></td>
                                            <td colSpan={2} style={{textAlign: 'center'}}>{packageInfo.name}</td>
                                        </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>}
        </>
    );
};

export default PackageCart;