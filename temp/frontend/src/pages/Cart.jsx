import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader/Loader';
import useLoading from '../hook/customHook';
const Cart = () => {
    const isLoading = useLoading();
    const storeData = useSelector(state => state.auth);
    const [cartItems, setCartItems] = useState([]);

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
    const subtotal = cartItems.reduce((total, item) => {
        return total + item.count * parseFloat(item.product.price);
    }, 0);

    const shippingCost = 45;

    const total = subtotal + shippingCost;
    const handleRemoveItem = (id) => {
        const cartData = localStorage.getItem(storeData.user.email);
        const parsedCart = JSON.parse(cartData);
        delete parsedCart[id];

        localStorage.setItem(storeData.user.email, JSON.stringify(parsedCart));
        setCartItems(Object.values(parsedCart));
    };
    const handleChangeQuantity = (id, newCount) => {
        if (!isNaN(newCount) && newCount > 0) {
            const cartData = localStorage.getItem(storeData.user.email);
            const parsedCart = JSON.parse(cartData);
            parsedCart[id].count = newCount;
            localStorage.setItem(storeData.user.email, JSON.stringify(parsedCart));
            setCartItems(Object.values(parsedCart));
        }
    };
    return (
        <>
            {isLoading && <Loader />}
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
                                                    <span onClick={() => handleRemoveItem(item.product.id)} ><i className="far fa-window-close"></i></span>
                                                </td>
                                                <td className="product-image">
                                                    <img src={item.product.image} alt={item.product.name} />
                                                </td>
                                                <td className="product-name">{item.product.name}</td>
                                                <td className="product-price">{item.product.price} tk</td>
                                                <td className="product-quantity">
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        value={item.count}
                                                        min={1}
                                                        max={10}
                                                        onChange={(e) => handleChangeQuantity(item.product.id, parseInt(e.target.value, 10))}
                                                    />
                                                </td>
                                                <td className="product-total">{(item.count * parseFloat(item.product.price)).toFixed(2)} tk</td>
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

                                    <Link to="/checkout" class="boxed-btn black">Check Out</Link>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;