import "../css/ReviewForm.css";
import "../css/mobile/ReviewForm.css";
import React, { useState } from "react";
import { useContext, useEffect } from "react";
import { projectFirestore, timestamp } from "../firebase/firebase-config";
import AuthContext from "../context/auth-context";
import useCollection from "../composables/useCollection";
import UserReview from "../components/UserReview";

const ReviewForm = ({ itemId }) => {
  const authCtx = useContext(AuthContext);

  const [reviewForm, setReviewForm] = useState(false);
  const [reviewHeadingValue, setReviewHeadingValue] = useState("");
  const [reviewValue, setReviewValue] = useState("");

  const { getReviewsCollection, data, error } = useCollection();

  // SHOW the review form
  const showReviewForm = () => {
    setReviewForm(true);
  };

  // HIDE the review form
  const hideReviewForm = () => {
    setReviewForm(false);
    setReviewValue("");
    setReviewHeadingValue("");
  };

  // Review object stored in firestore database
  const reviewObject = {
    userId: authCtx.contextValue.userId,
    userDipslayName: authCtx.contextValue.userDisplayName,
    userReviewHeading: reviewHeadingValue.trim(),
    userReview: reviewValue.trim(),
    createdAt: timestamp(),
  };

  // ADD a review to the firestore database
  const submitReviewHandler = async (e) => {
    e.preventDefault();

    // SUBMIT the review to firestore database
    if (authCtx.contextValue.isSignedIn) {
      await projectFirestore
        .collection("reviews")
        .doc(itemId)
        .collection("user-reviews")
        .doc(authCtx.contextValue.userId)
        .set(reviewObject);
      // CLOSE form after successful review submission
      hideReviewForm();
    } else {
      authCtx.contextValue.openAuthModal();
    }
  };

  // UPDATE a review document in firestore database
  const updateReview = async (newReviewValue, newReviewHeadingValue) => {
    await projectFirestore
      .collection("reviews")
      .doc(itemId)
      .collection("user-reviews")
      .doc(authCtx.contextValue.userId)
      .update({
        userReviewHeading: newReviewHeadingValue,
        userReview: newReviewValue,
      });
  };

  useEffect(() => {
    getReviewsCollection(itemId);
    return () => {};
  }, []);

  return (
    <div id="review-form-container">
      <h2 className="review-form-toggle" onClick={showReviewForm}>
        Add a review <i className="fas fa-plus-circle"></i>
      </h2>
      {reviewForm && (
        <form className="review-form" onSubmit={submitReviewHandler}>
          <label htmlFor="review-heading">Review heading</label>
          <input
            type="text"
            id="review-heading"
            autoComplete="off"
            value={reviewHeadingValue}
            onChange={(e) => setReviewHeadingValue(e.target.value)}
            required
          />

          <label htmlFor="review">Your review</label>
          <textarea
            id="review"
            autoComplete="off"
            onChange={(e) => setReviewValue(e.target.value)}
            value={reviewValue}
            required
          ></textarea>

          <div className="tips">
            <i className="fas fa-exclamation-circle fa-icon"></i>
            <p>
              Warning: If you already have written a review here, it will be
              rewritten. Please be certain about it!
            </p>
          </div>

          <div className="button-group">
            <button className="btn">Submit Review</button>

            <button className="btn btn-alt-dark" onClick={hideReviewForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <h2 className="review-form-reviews-heading">See what other people say</h2>

      {data && (
        <div className="review-form-user-reviews">
          {data.map((data) => (
            <UserReview
              data={data}
              key={data.userId}
              onReviewUpdate={updateReview}
            />
          ))}
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ReviewForm;
