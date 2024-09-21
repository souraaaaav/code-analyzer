import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { forget_password } from '../actions/auth';
import Loader from '../components/Loader/Loader';
import useLoading from '../hook/customHook';

const ForgetPasswordStart = () => {
    const isLoading = useLoading();
    const storeData = useSelector(state => state.auth);

    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const handleSubmit = () => {
        dispatch(forget_password({ email }));
    };
    return (
        <>
            {(isLoading || storeData.isLoading) && <Loader />}

            <div class="breadcrumb-section breadcrumb-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="breadcrumb-text">
                                <p>Change your password </p>
                                <h1>Forget Password</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="checkout-section mt-100 mb-150">
                {storeData.passwordResetRequest === "email found" ? <div class="container">
                    <div class="row">
                        <div class="col-lg-9 mx-auto text-center">
                            <div class="checkout-accordion-wrap">
                                <div class="accordion" id="accordionExample">
                                    <div class="card single-accordion">
                                        <div class="card-header" id="headingOne">
                                            <h5 class="mb-0">
                                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                    A reset instructions sent to your email! <a href="http://www.gmail.com" ><span style={{ marginLeft: '5px', textDecoration: 'underline' }}>Click here to open Gmail</span></a>

                                                </button>
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> :
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
                                                        Enter your email for forget password
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
                                                                    onChange={(e) => setEmail(e.target.value)}
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
                }
            </div>
        </>
    );
};

export default ForgetPasswordStart;