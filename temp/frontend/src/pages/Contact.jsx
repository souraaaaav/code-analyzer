import React from 'react';
import Loader from '../components/Loader/Loader';
import useLoading from '../hook/customHook';
const Contact = () => {
    const isLoading = useLoading();

    return (
        <>
            {isLoading && <Loader />}

            <div class="breadcrumb-section breadcrumb-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="breadcrumb-text">
                                <p>Get 24/7 Support</p>
                                <h1>Contact us</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="contact-from-section mt-150 mb-150">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 mb-5 mb-lg-0">
                            <div class="form-title">
                                <h2>Have you any question?</h2>
                                <p>If you have any question please contact us as we can dsolve your problem and develop our food
                                    quality.Thank you!</p>
                            </div>
                            <div id="form_status"></div>
                            <div class="contact-form">
                                <form type="POST" id="fruitkha-contact">
                                    <p>
                                        <input type="text" placeholder="Subject" name="subject" id="subject" />
                                    </p>
                                    <p><textarea name="message" id="message" cols="30" rows="10"
                                        placeholder="Message"></textarea></p>

                                    <p><input type="submit" value="Submit" /></p>

                                </form>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="contact-form-wrap">
                                <div class="contact-form-box">
                                    <h4><i class="fas fa-map"></i> Shop Address</h4>
                                    <p>34/8, East Hukupara <br /> Sonapur <br /> Noakhali</p>
                                </div>
                                <div class="contact-form-box">
                                    <h4><i class="far fa-clock"></i> Shop Hours</h4>
                                    <p>MON - FRIDAY: 8 to 9 PM <br /> SAT - SUN: 10 to 8 PM </p>
                                </div>
                                <div class="contact-form-box">
                                    <h4><i class="fas fa-address-book"></i> Contact</h4>
                                    <p>Phone: +01945735665 <br /> Email: support@labonno.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;;;