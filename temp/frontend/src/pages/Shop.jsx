import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader/Loader';
import axios from '../helper/axios-helper.js';
import useLoading from '../hook/customHook';
import './SingleProduct.css';
const Shop = () => {
    const isLoading = useLoading();
    const dispatch = useDispatch();
    const storeData = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [packages, setPackages] = useState([]);

    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setLoading(true);

        let apiUrl = '/products/';


        apiUrl += `?page=${currentPage}`;


        if (filter !== 'All') {
            apiUrl += `&product_type=${filter}`;
        }

        if (searchTerm) {
            apiUrl += `&search=${searchTerm}`;
        }

        axios.get(apiUrl)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });

        axios.get('/packages/')
            .then(response => {
                setPackages(response.data);
            })
            .catch(error => {
                console.error('Error fetching packages:', error);
            });
        setLoading(false);

    }, [filter, searchTerm, currentPage]);
    const handleFilterChange = (filterValue) => {
        setFilter(filterValue);
        setCurrentPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    function renderStars(rating) {
        const stars = [];
        const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5

        for (let i = 1; i <= 5; i++) {
            if (i <= roundedRating) {
                // Full star
                stars.push(<span key={i} className="fas fa-star checked"></span>);
            } else if (i - 0.5 === roundedRating) {
                // Half star
                stars.push(<span key={i} className="fas fa-star-half-alt checked"></span>);
            } else {
                // No rating star
                stars.push(<span key={i} className="fa-regular fa-star checked"></span>);
            }
        }

        return stars;
    }
    const renderPagination = () => {
        const totalPages = Math.ceil(products?.count / 6);
        if (totalPages <= 1) {
            return null;
        }

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <li key={i} >
                    <span className={currentPage === i ? 'pagination-btn active' : 'pagination-btn'} onClick={() => handlePageChange(i)}>{i}</span>
                </li>
            );
        }

        return (
            <div className="pagination-wrap">
                <ul>
                    <li>
                        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className={currentPage === 1 ? 'pagination-btn disabled' : 'pagination-btn '}>
                            Prev
                        </button>
                    </li>
                    {pageNumbers}
                    <li>
                        <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className={currentPage === totalPages ? 'pagination-btn disabled' : 'pagination-btn '}>
                            Next
                        </button>
                    </li>
                </ul>
            </div>
        );
    };
    const addToCart = (product) => {
        const email = storeData?.user?.email;
        let cartData = localStorage.getItem(email);
        if (!cartData) {
            cartData = {};
        } else {
            cartData = JSON.parse(cartData);
        }
        if (cartData[product.id]) {
            cartData[product.id].count += 1;
        } else {
            cartData[product.id] = {
                product: product,
                count: 1
            };
        }

        localStorage.setItem(email, JSON.stringify(cartData));
        toast.success(`${product.name} added to the cart`);
    };
    return (
        <>
            {(isLoading) && <Loader />}

            <div class="breadcrumb-section breadcrumb-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="breadcrumb-text">
                                <p>Fresh and Organic</p>
                                <h1>Shop</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="product-section mt-100 mb-150">
                <div class="container">

                    <div class="row">
                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="section-title">
                                <h3><span class="orange-text">Our</span> Packages</h3>
                            </div>
                        </div>
                        <div class="latest-news mb-20">
                            <div class="container">
                                <div class="row">
                                    {
                                        packages.map(pkg => (
                                            <div key={pkg.id} className="col-lg-6 col-md-6">
                                                <div className="single-latest-news">
                                                    <Link to={`/single-package/${pkg.id}`}>
                                                        <div class="latest-news-bg"
                                                            style={{ backgroundImage: `url(${pkg.image})` }}
                                                        >
                                                        </div>
                                                    </Link>
                                                    <div className="news-text-box">
                                                        <div class="news-text-box">
                                                            <h3><Link to={`/single-package/${pkg.id}`}>{pkg.name}</Link></h3>

                                                            <p class="excerpt">{pkg.description}</p>
                                                            <Link to={`/single-package/${pkg.id}`} class="read-more-btn">Purchase Package <i
                                                                class="fas fa-angle-right"></i></Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-8 offset-lg-2 text-center" style={{ marginTop: '50px' }}>
                            <div class="section-title">
                                <h3><span class="orange-text">Our</span> Daily Products</h3>
                            </div>
                        </div>
                        <div class="col-md-12 mb-20">
                            <div class="product-filters">
                                <ul>
                                    <li className={filter === 'All' ? 'active' : ''} onClick={() => handleFilterChange('All')}>
                                        All
                                    </li>
                                    <li className={filter === 'Breakfast' ? 'active' : ''} onClick={() => handleFilterChange('Breakfast')}>
                                        Breakfast
                                    </li>
                                    <li className={filter === 'Lunch' ? 'active' : ''} onClick={() => handleFilterChange('Lunch')}>
                                        Lunch
                                    </li>
                                    <li className={filter === 'Dinner' ? 'active' : ''} onClick={() => handleFilterChange('Dinner')}>
                                        Dinner
                                    </li>
                                    <li>
                                        <i className="fas fa-search" style={{ marginRight: '10px' }}></i>
                                        <input
                                            type="text"
                                            placeholder="Search Product"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            style={{ border: 'none', outline: 'none' }}
                                        />
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="col-lg-12 col-md-12 product-lists">
                            {loading ? <p>Loading</p> :
                                products?.results?.map(product => (
                                    <div key={product.id} className="col-lg-4 col-md-6 text-center">
                                        <div className="single-product-item">
                                            <div className="product-image">
                                                <Link to={`/single-product/${product.id}`}><img src={product.image} alt={product.name} /> </Link>
                                            </div>

                                            <h3>{product.name}</h3>
                                            <div className="rating">
                                                {/* Render the star icons based on the rating */}
                                                {renderStars(product.rating)}
                                            </div>
                                            <p className="product-price"><span>per Kg</span>{product.price} tk</p>
                                            <span class="cart-btn" onClick={() => addToCart(product)}><i class="fas fa-shopping-cart"></i> Add to Cart</span>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div class="row w-100">
                            <div class="col-lg-12 text-center">
                                {/* <div class="pagination-wrap">
                                    <ul>
                                        <li><a href="#">Prev</a></li>
                                        <li><a href="#">1</a></li>
                                        <li><a class="active" href="#">2</a></li>
                                        <li><a href="#">3</a></li>
                                        <li><a href="#">Next</a></li>
                                    </ul>
                                </div> */}
                                {renderPagination()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default Shop;