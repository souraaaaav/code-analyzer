import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import Loader from '../components/Loader/Loader';
import axios from "../helper/axios-helper";
import useLoading from '../hook/customHook';

const RegistrationDeliveryMan = () => {
    const isLoading = useLoading();
    const [openEmail, setOpenEmail] = useState(false);
    const profileImageInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        profilePic: null,
        password: '',
        confirmPassword: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            profilePic: file,
        });
    };
    const handleTextClick = () => {
        profileImageInputRef.current.click();
    };
    const isFormDataValid = () => {
        for (const key in formData) {
            if (!formData[key]) {
                return false;
            }
        }
        return true;
    };
    const handleSubmit = async () => {
        try {
            if (formData.password !== formData.confirmPassword) {
                toast.warning('Password didn\'t match!!!');
                return;
            }
            setLoading(true);
            const regformData = new FormData();
            regformData.append('name', formData.name);
            regformData.append('email', formData.email);
            regformData.append('phone', formData.phone);
            regformData.append('password', formData.password);
            regformData.append('user_type', 'delivery_man');
            if (formData.profilePic) {
                regformData.append('profile_pic', formData.profilePic);
            }
            if (!isFormDataValid()) {
                setLoading(false);
                toast.warning('Please fill all the field');
                return;
            }
            console.log(regformData);
            const response = await axios.post('/signup/user/', regformData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setLoading(false);
            setOpenEmail(true);
            toast.success("Registration Succesful!!! Confirm from Email..");


        } catch (error) {

            setLoading(false);
            toast.error("Something went wrong!");
        }
    };
    return (
        <>
            {(isLoading || loading) && <Loader />}
            <div class="breadcrumb-section breadcrumb-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="breadcrumb-text">
                                <p>Join With us </p>
                                <h1>Registration as Delivery Man</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="checkout-section mt-100 mb-150">
                {openEmail ? <div class="container">
                    <div class="row">

                        <div class="col-lg-9 mx-auto text-center">
                            <div class="checkout-accordion-wrap">
                                <div class="accordion" id="accordionExample">
                                    <div class="card single-accordion">
                                        <div class="card-header" id="headingOne">
                                            <h5 class="mb-0">
                                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                    Registration Successful! Confirm your account from email! <a href="http://www.gmail.com" ><span style={{ marginLeft: '5px', textDecoration: 'underline' }}>Click here to open Gmail</span></a>

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
                            <div className="col-lg-3">

                            </div>
                            <div class="col-lg-9 mx-auto text-center">
                                <div class="checkout-accordion-wrap">
                                    <div class="accordion" id="accordionExample">
                                        <div class="card single-accordion">
                                            <div class="card-header" id="headingOne">
                                                <h5 class="mb-0">
                                                    <button class="btn btn-link" type="button" data-toggle="collapse"
                                                        data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                        Enter Details For Registration as Delivery Man
                                                    </button>
                                                </h5>
                                            </div>


                                            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne"
                                                data-parent="#accordionExample">
                                                <div class="card-body">
                                                    <div class="billing-address-form">
                                                        <form onSubmit={handleSubmit}>
                                                            <p>
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    placeholder="Name"
                                                                    value={formData.name}
                                                                    onChange={handleChange}
                                                                />
                                                            </p>
                                                            <p>
                                                                <input
                                                                    type="text"
                                                                    name="email"
                                                                    placeholder="Email"
                                                                    value={formData.email}
                                                                    onChange={handleChange}
                                                                />
                                                            </p>
                                                            <p>
                                                                <input
                                                                    type="tel"
                                                                    name="phone"
                                                                    placeholder="Phone Number"
                                                                    value={formData.phone}
                                                                    onChange={handleChange}
                                                                />
                                                            </p>
                                                            <p>
                                                                <input
                                                                    type="password"
                                                                    name="password"
                                                                    placeholder="Password"
                                                                    value={formData.password}
                                                                    onChange={handleChange}
                                                                />
                                                            </p>
                                                            <p>
                                                                <input
                                                                    type="password"
                                                                    name="confirmPassword"
                                                                    placeholder="Confirm Password"
                                                                    value={formData.confirmPassword}
                                                                    onChange={handleChange}
                                                                />
                                                            </p>
                                                            <p class="d-flex flex-row-reverse" style={{ gap: '20px' }}>
                                                                {formData.profilePic && (
                                                                    <img
                                                                        src={URL.createObjectURL(formData.profilePic)}
                                                                        alt="Profile Preview"
                                                                        style={{
                                                                            width: "160px",
                                                                            height: "100px",
                                                                        }}
                                                                    />
                                                                )}
                                                                <input
                                                                    type="text"
                                                                    style={{ cursor: 'pointer' }}
                                                                    placeholder="Upload a Profile Picture"
                                                                    value={formData.profilePic ? formData.profilePic.name : 'Upload a Profile Picture'}
                                                                    onClick={handleTextClick}
                                                                    readOnly
                                                                />
                                                                <input
                                                                    type="file"
                                                                    ref={profileImageInputRef}
                                                                    style={{ display: 'none' }}
                                                                    onChange={handleFileChange}
                                                                    accept="image/*"
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
                                                        Create Account
                                                    </span>
                                                </h5>

                                            </div>
                                        </div>

                                        <div class="d-flex flex-row-reverse justify-content-between">
                                            <div class="hero-btns">
                                                <Link to="/login" class="boxed-btn" id="boxed-btn">Already have an
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
                }
            </div>
        </>
    );
};

export default RegistrationDeliveryMan;