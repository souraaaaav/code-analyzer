import React from 'react';

const Footer = () => {
    return (
        <>
            <div class="footer-area">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-4 col-md-6">
                            <div class="footer-box about-widget">
                                <h2 class="widget-title">About us</h2>
                                <p>Serving best and qualityful food.</p>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6">
                            <div class="footer-box get-in-touch">
                                <h2 class="widget-title">Get in Touch</h2>
                                <ul>
                                    <li>Noakhali Science & Technology University.</li>
                                    <li>support@labonno.com</li>
                                    <li>+0190457377</li>
                                </ul>
                            </div>
                        </div>

                        <div class="col-lg-4 col-md-6">
                            <div class="footer-box subscribe">
                                <h2 class="widget-title">Subscribe</h2>
                                <p>Subscribe to our mailing list to get the latest updates.</p>
                                <form action="index.html">
                                    <input type="email" placeholder="Email" />
                                    <button type="submit"><i class="fas fa-paper-plane"></i></button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="copyright">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 text-center">
                            <p>Copyrights &copy; 2024 - <a href="https://www.facebook.com/labonno.ahmed.12345">Labonno
                                Ahmed</a>, All Rights Reserved.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;