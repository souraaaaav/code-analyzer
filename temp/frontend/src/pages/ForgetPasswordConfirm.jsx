import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forget_password_confirm } from '../actions/auth';
import Loader from '../components/Loader/Loader';
import useLoading from '../hook/customHook';

const ForgetPasswordConfirm = () => {
    const isLoading = useLoading();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const storeData = useSelector(state => state.auth);
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const dispatch = useDispatch();
    const handleSubmit = () => {
        if (password !== repeatPassword) {
            toast.warn(`password didn't match`);
            return;
        }
        if (password === "" || repeatPassword === "") {
            toast.warn(`password can't be empty`);
            return;
        }
        dispatch(forget_password_confirm({ password, token }));
    };

    if (storeData.isAuthenticated && storeData.user && storeData.user.is_verified) {
        toast.success("login success");
        return <Navigate to="/shop" />;
    }

    else if (!storeData.isAuthenticated && !storeData.user && storeData.passwordResetRequest === "reset done") {
        return <Navigate to="/login" />;
    }
    return (
        <>
            {(isLoading || storeData.isLoading) && <Loader />}

            <div class="breadcrumb-section breadcrumb-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="breadcrumb-text">
                                <p>Change your password </p>
                                <h1>Set New Password</h1>
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
                                                    Enter your password to set new password
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
                                                                type="password"
                                                                placeholder="Passowrd"
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                            />
                                                        </p>
                                                        <p>
                                                            <input
                                                                type="password"
                                                                placeholder="Confirm Password"
                                                                value={repeatPassword}
                                                                onChange={(e) => setRepeatPassword(e.target.value)}
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
                                                    Submit
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
                                            <Link to="/login" class="boxed-btn" id="boxed-btn">Already have an
                                                account?</Link>

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

export default ForgetPasswordConfirm;