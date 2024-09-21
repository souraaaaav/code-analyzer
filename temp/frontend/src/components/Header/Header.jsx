import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../actions/auth';
import logo from '../../assets/img/logo1.png';
import './Header.css';
const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isScrolled, setIsScrolled] = useState(false);
    const cartData = useSelector(state => state.cart);
    const storeData = useSelector(state => state.auth);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            const isScrolled = currentScrollPos > 0;
            setIsScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const menuToggle = () => {
        console.log('clicked');
        const toggleMenu = document.querySelector(".menu");
        toggleMenu.classList.toggle("active");
    };
    const handleLogout = () => {

        dispatch(logout());
        navigate('/');
    };
    return (
        <div id="sticker-sticky-wrapper" class="sticky-wrapper is-sticky">
            <div className={`top-header-area ${isScrolled ? 'scrolled' : ''}`} id="sticker" style={{ 'position': 'fixed', 'top': '0px', 'z-index': 'inherit' }}>
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12 col-sm-12 text-center">
                            <div class="main-menu-wrap">

                                <div class="site-logo">
                                    <Link to="/">
                                        <img src={logo} alt="" />
                                    </Link>
                                </div>



                                <nav class="main-menu">
                                    <ul>
                                        <li>
                                            <NavLink exact to="/"
                                                className={({ isActive }) => isActive ? "current-list-item" : ""}>Home</NavLink>
                                        </li>
                                        {(storeData.isAuthenticated && storeData.user && storeData.user.is_verified && storeData.user.is_customer) ?
                                            <>
                                                <li>
                                                    <NavLink exact to="/shop"
                                                        className={({ isActive }) => isActive ? "current-list-item" : ""}>Menu</NavLink>
                                                </li><li>
                                                    <NavLink exact to="/orders"
                                                        className={({ isActive }) => isActive ? "current-list-item" : ""}>My Orders</NavLink>
                                                </li>
                                            </> : null
                                        }
                                        {(storeData.isAuthenticated && storeData.user && storeData.user.is_verified && storeData.user.is_delivery_man) ?
                                            <>
                                                <li>
                                                    <NavLink exact to="/delivery-dashboard"
                                                        className={({ isActive }) => isActive ? "current-list-item" : ""}>Dashboard</NavLink>
                                                </li>
                                            </> : null
                                        }
                                        {(storeData.isAuthenticated && storeData.user && storeData.user.is_verified && !(storeData.user.is_customer || storeData.user.is_delivery_man)) ?
                                            <>
                                                <li>
                                                    <NavLink exact to="/seller-dashboard"
                                                        className={({ isActive }) => isActive ? "current-list-item" : ""}>Dashboard</NavLink>
                                                </li>
                                            </> : null
                                        }
                                        <li>
                                            <NavLink exact to="/about"
                                                className={({ isActive }) => isActive ? "current-list-item" : ""}>About us</NavLink>
                                        </li>
                                        <li>
                                            <NavLink exact to="/contact"
                                                className={({ isActive }) => isActive ? "current-list-item" : ""}>Contact us</NavLink>
                                        </li>
                                        {(storeData.isAuthenticated && storeData.user && storeData.user.is_verified && storeData.user.is_customer) ?
                                            <li className='last-child'>
                                                <div class="header-icons" style={{ position: 'relative' }}>
                                                    <Link class="shopping-cart" to="/cart">Cart <i class="fa" style={{ fontSize: '24px' }}>&#xf07a;</i>

                                                    </Link>
                                                </div>

                                            </li>
                                            : null}
                                    </ul>
                                </nav>
                                {(storeData.isAuthenticated && storeData.user && storeData.user.is_verified) ?
                                    <div className='logout-button'>
                                        <div class="action" >
                                            <div class="profile">
                                                <img src={storeData?.user?.profile_pic} onClick={menuToggle} />
                                            </div>
                                            <div class="menu">
                                                <h3>{storeData?.user?.name}<br />
                                                </h3>
                                                <ul>
                                                    <li>
                                                        <span onClick={handleLogout}>Logout</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div> : null}
                                <div class="mobile-menu"></div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;