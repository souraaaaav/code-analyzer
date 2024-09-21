import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../actions/auth';
import Loader from '../components/Loader/Loader';
import useLoading from '../hook/customHook';

const Login = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const isLoading = useLoading();
    const storeData = useSelector(state => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (searchParams.get('came_from') === "verified") {
            toast.success("Account verification successful");
        }
    }, []);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleSubmit = () => {
        dispatch(login(email, password));
    };

    if (storeData.isAuthenticated && storeData.user && storeData.user.is_verified && storeData.user.is_customer) {
        toast.success("login success");
        return <Navigate to="/shop" />;
    }
if (storeData.isAuthenticated && storeData.user && storeData.user.is_verified && storeData.user.is_delivery_man) {
        toast.success("login success");
        return <Navigate to="/delivery-dashboard" />;
    }
    if (storeData.isAuthenticated && storeData.user && storeData.user.is_verified) {
        return <Navigate to="/seller-dashboard" />;
    }
    return (
        <>
            {(isLoading || storeData.isLoading) && <Loader />}

            <div class="breadcrumb-section breadcrumb-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="breadcrumb-text">
                                <p>Join With us </p>
                                <h1>Log In</h1>
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
                                <div class="accordion" id="accordionExample">
                                    <div class="card single-accordion">
                                        <div class="card-header" id="headingOne">
                                            <h5 class="mb-0">
                                                <button class="btn btn-link" type="button" data-toggle="collapse"
                                                    data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                    Enter Credentials For Login
                                                </button>
                                            </h5>
                                        </div>


                                        <div id="collapseOn" class="collapse show" aria-labelledby="headingOne"
                                            data-parent="#accordionExample">
                                            <div class="card-body">
                                                <div class="billing-address-form">
                                                    <form onSubmit={handleSubmit}>
                                                        <p>
                                                            <input
                                                                type="text"
                                                                placeholder="Email"
                                                                value={email}
                                                                onChange={handleEmailChange}
                                                            />
                                                        </p>
                                                        <p>
                                                            <input
                                                                type="password"
                                                                placeholder="Password"
                                                                value={password}
                                                                onChange={handlePasswordChange}
                                                            />
                                                        </p>

                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="row">

                                    </div>

                                    <div class="card single-accordion">
                                        <div class="card-header" id="headingOne">

                                            <h5 class='create-post-submit-btn' onClick={handleSubmit}>
                                                <span>
                                                    Login
                                                </span>
                                            </h5>

                                        </div>
                                    </div>

                                    <div class="d-flex flex-row-reverse justify-content-between">
                                        <div class="hero-btns">
                                            <Link to="/registration" class="boxed-btn" id="boxed-btn">Don't have an
                                                account?</Link>
                                        </div>
                                        <div class="hero-btns">
                                            <Link to="/forget-password-start" class="boxed-btn" id="boxed-btn">Forget
                                                Password?</Link>

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

export default Login;