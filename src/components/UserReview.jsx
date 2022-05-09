import "../css/UserReview.css";
import "../css/mobile/UserReview.css";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/auth-context";

const UserReview = ({ data, onReviewUpdate }) => {
  const authCtx = useContext(AuthContext);

  const currentReview = data.userReview;
  const currentReviewHeading = data.userReviewHeading;

  const [editReview, setEditReview] = useState(false);
  const [newReview, setNewReview] = useState(currentReview);
  const [newReviewHeading, setNewReviewHeading] =
    useState(currentReviewHeading);

  // SHOW edit review bar
  const showEditReview = () => {
    setEditReview(true);
  };

  // HIDE edit review bar
  const hideEditReview = () => {
    setEditReview(false);
    setNewReview(currentReview);
    setNewReviewHeading(currentReviewHeading);
  };

  // Emit edited review
  const updateReview = () => {
    onReviewUpdate(newReview, newReviewHeading);
    hideEditReview();
  };

  // HIDE edit review bar if the user is not signed in
  useEffect(() => {
    if (!authCtx.contextValue.isSignedIn) {
      setEditReview(false);
    }
    return () => {};
  }, [authCtx.contextValue.isSignedIn]);

  return (
    <div id="user-review-container">
      <div className="user-review-info">
        <div className="user-review-author-options">
          <div>
            <h3 className="user-review-author">{data.userDipslayName}</h3>
            {data.createdAt && (
              <p className="user-review-date grey-text">
                {data.createdAt.toDate().toDateString()}
              </p>
            )}
          </div>
          {authCtx.contextValue.isSignedIn &&
            authCtx.contextValue.userId === data.userId && (
              <i
                className={`fas fa-edit fa-icon edit-review-icon ${
                  editReview ? "active" : ""
                }`}
                onClick={showEditReview}
              ></i>
            )}
        </div>

        {!editReview && (
          <p className="user-review-heading">
            Review heading:{" "}
            <span className="green-text">{data.userReviewHeading}</span>
          </p>
        )}
        {!editReview && <p className="user-review">{data.userReview}</p>}

        {editReview && (
          <div className="user-review-edit-container">
            <label htmlFor="review-heading">Review Heading:</label>

            <input
              type="text"
              id="review-heading"
              value={newReviewHeading}
              onChange={(e) => setNewReviewHeading(e.target.value)}
            />

            <label htmlFor="review">Review:</label>
            <textarea
              id="review"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
            ></textarea>

            <div className="tips">
              <i className="fas fa-exclamation-circle fa-icon"></i>
              <p>
                It may take up to a minute for your change to be displayed on
                the screen.
              </p>
            </div>

            <div className="button-group">
              <button className="btn" onClick={updateReview}>
                Done
              </button>
              <button className="btn btn-alt-dark" onClick={hideEditReview}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReview;
