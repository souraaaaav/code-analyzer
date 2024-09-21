import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader/Loader";
import axios from "../helper/axios-helper";
import useLoading from "../hook/customHook";
import "./SingleProduct.css";
import Swal from "sweetalert2";

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const isLoading = useLoading();
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState(null);

  const [newComment, setNewComment] = useState("");
  const [canComment, setCanComment] = useState(false);
  const [canRate, setCanRate] = useState(false);

  const [currentRating, setCurrentRating] = useState(0);

  const storeData = useSelector((state) => state.auth);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/products/${id}/`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchCanRate = async () => {
    if (storeData?.token) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${storeData.token}`,
        },
      };
      try {
        const response = await axios.get(`/products/${id}/can-rate/`, config);

        setCanRate(response.data.can_rate);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
  };

  const fetchRate = async () => {
    if (storeData?.token) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${storeData.token}`,
        },
      };
      try {
        const response = await axios.get(`/products/${id}/get-rating/`, config);
        console.log("canRate", response.data.rating);

        setRatings(response.data.rating);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
  };
  const fetchComments = async () => {
    try {
      const response = await axios.get(`/products/${id}/comments/`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  const checkCanComment = async () => {
    if (storeData?.token) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${storeData.token}`,
          },
        };
        const response = await axios.get(
          `/products/${id}/can-comment/`,
          config
        );
        setCanComment(response.data.can_comment);
      } catch (error) {
        console.error("Error checking if user can comment:", error);
      }
    }
  };
  const fetchData = () => {
    fetchProduct();
    fetchCanRate();
    fetchRate();
    fetchComments();
    checkCanComment();
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async () => {
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${storeData.token}`,
        },
      };
      await axios.post(
        `/products/${id}/create-product-comment/`,
        {
          comment: newComment,
        },
        config
      );
      setNewComment("");
      // Refresh comments after submitting
      fetchData();
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error("Error adding comment:", error);
    }
  };
  console.log(comments, canComment, canRate, ratings);
  function renderStars(rating) {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        // Full star
        stars.push(<span key={i} className="fas fa-star checked"></span>);
      } else if (i - 0.5 === roundedRating) {
        // Half star
        stars.push(
          <span key={i} className="fas fa-star-half-alt checked"></span>
        );
      } else {
        // No rating star
        stars.push(
          <span key={i} className="fa-regular fa-star checked"></span>
        );
      }
    }

    return stars;
  }
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
        count: 1,
      };
    }

    localStorage.setItem(email, JSON.stringify(cartData));
    toast.success(`${product.name} added to the cart`);
  };
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleStarClick = async (rating) => {
    setCurrentRating(rating);

    Swal.fire({
      title: "Confirm Rating?",
      text: "Are you sure you want to set this rating?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, set rating",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);

        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${storeData.token}`,
            },
          };

          await axios.post(
            `/products/${id}/rate/`,
            {
              rating: rating,
            },
            config
          );
          fetchData();
          setLoading(false);
          Swal.fire({
            title: "Rating Set!",
            text: `You have set the rating to ${rating}`,
            icon: "success",
          });
        } catch (error) {
          setLoading(false);
          console.error("Error setting rating:", error);
        }
      } else {
        setCurrentRating(0);
      }
    });
  };

  const renderCurrentStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= currentRating) {
        stars.push(
          <span
            key={i}
            className="fas fa-star checked"
            onClick={() => handleStarClick(i)}
          ></span>
        );
      } else {
        stars.push(
          <span
            key={i}
            className="fa-regular fa-star checked"
            onClick={() => handleStarClick(i)}
          ></span>
        );
      }
    }

    return stars;
  };

  return (
    <>
      {(isLoading || loading) && <Loader />}

      <div class="breadcrumb-section breadcrumb-bg">
        <div class="container">
          <div class="row">
            <div class="col-lg-8 offset-lg-2 text-center">
              <div class="breadcrumb-text">
                <p>See more Details</p>
                <h1>Single Package</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="single-product mt-150 mb-100">
        <div class="container">
          {product && (
            <div class="row">
              <div class="col-md-5">
                <div class="single-product-img">
                  <img src={product.image} alt="" />
                </div>
              </div>
              <div class="col-md-7">
                <div class="single-product-content">
                  <h3>{product.name}</h3>
                  <div className="rating">{renderStars(product.rating)}</div>
                  <p class="single-product-pricing">
                    <span></span> {product.price}
                  </p>
                  <p>{product.description}</p>
                  <div class="single-product-form">
                    <span onClick={() => addToCart(product)} class="cart-btn">
                      {" "}
                      <i class="fas fa-shopping-cart"></i> Add to cart
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div class="row">
            <div class="comments-list-wrap">
              <h3 class="comment-count-title">
                {comments.length} Comment{comments.length > 1 && "s"}
              </h3>
              <div class="comment-list">
                {comments && comments.length > 0 ? (
                  comments.map((comment, i) => (
                    <div class="single-comment-body">
                      <div class="comment-user-avater">
                        <img src={comment.user.profile_pic} alt="" />
                      </div>
                      <div class="comment-text-body">
                        <h4>
                          {comment.user.name}{" "}
                          <span class="comment-date">
                            {formatDate(comment.created_at)}
                          </span>{" "}
                        </h4>
                        <p>{comment.comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <h4>no one has commented yet</h4>
                )}
              </div>
            </div>
          </div>
          {canComment && (
            <div class="col-lg-12">
              <div class="comment-template">
                <div className="rating" style={{ marginBottom: "30px" }}>
                  {canRate ? (
                    <>
                      <span>Rate the Product: </span>

                      {renderCurrentStars()}
                    </>
                  ) : ratings ? (
                    <>
                      <span>You Have Rated: </span>

                      {renderStars(ratings)}
                    </>
                  ) : null}
                </div>

                <h4>Leave a comment</h4>
                <p>
                  If you have a comment dont feel hesitate to send us your
                  opinion.
                </p>
                <form>
                  <p>
                    <textarea
                      name="comment"
                      id="comment"
                      cols="20"
                      rows="3"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={handleCommentChange}
                    ></textarea>
                  </p>
                  <p>
                    <input
                      className="cart-btn"
                      type="button"
                      value={"Submit"}
                      onClick={handleCommentSubmit}
                    />
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
