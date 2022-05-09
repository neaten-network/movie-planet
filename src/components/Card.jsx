import "../css/Card.css";
import "../css/mobile/Card.css";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { projectFirestore, timestamp } from "../firebase/firebase-config";
import ApiContext from "../context/api-context";
import AuthContext from "../context/auth-context";

const Card = ({ data }) => {
  const apiCtx = useContext(ApiContext);
  const authCtx = useContext(AuthContext);
  const route = useHistory();

  const [bookmarked, setBookmarked] = useState(false);

  // HANDLE card item click
  const cardClickHandler = (e) => {
    if (!e.target.classList.contains("fa-bookmark")) {
      if (data.title && data.release_date) {
        route.push(`/movie-details/${data.id}`);
      } else if (data.name && data.first_air_date) {
        route.push(`/tv-show-details/${data.id}`);
      }
    }
  };

  // Object stored in firebase
  const bookmarkedItem = {
    item: data,
    createdAt: timestamp(),
  };

  const bookmarkedItemId = data.id.toString();

  // Define sub-collection name
  let subCollectionName;
  if (data.title) {
    subCollectionName = "movies";
  }
  if (data.name) {
    subCollectionName = "tvs";
  }

  // ADD item to firestore database
  const addToSaved = async () => {
    if (subCollectionName && authCtx.contextValue.isSignedIn) {
      await projectFirestore
        .collection("users")
        .doc(authCtx.contextValue.userId)
        .collection(subCollectionName)
        .doc(bookmarkedItemId)
        .set(bookmarkedItem);
      setBookmarked(true);
    } else {
      authCtx.contextValue.openAuthModal();
    }
  };

  // REMOVE item from firestore database
  const removeFromSaved = async () => {
    if (subCollectionName && authCtx.contextValue.isSignedIn) {
      await projectFirestore
        .collection("users")
        .doc(authCtx.contextValue.userId)
        .collection(subCollectionName)
        .doc(bookmarkedItemId)
        .delete();
      setBookmarked(false);
    }
  };

  // CHECK if item exists in firestore database
  const isSaved = async () => {
    if (
      subCollectionName &&
      authCtx.contextValue.isSignedIn &&
      authCtx.contextValue.userId
    ) {
      const docRef = projectFirestore
        .collection("users")
        .doc(authCtx.contextValue.userId)
        .collection(subCollectionName)
        .doc(bookmarkedItemId);

      const doc = await docRef.get();
      if (doc.exists) {
        setBookmarked(true);
      } else {
        setBookmarked(false);
      }
    } else {
      setBookmarked(false);
    }
  };

  useEffect(() => {
    isSaved();
    return () => {};
  }, [authCtx.contextValue.userId, subCollectionName]);

  return (
    <article id="item-card" onClick={cardClickHandler}>
      <div className="item-card-poster">
        {!data.character && data.poster_path && (
          <div className="item-card-icon-container">
            {!bookmarked && (
              <i
                className="far fa-bookmark fa-icon item-card-bookmark-icon"
                onClick={addToSaved}
              ></i>
            )}
            {bookmarked && (
              <i
                className="fas fa-bookmark fa-icon item-card-bookmark-icon checked"
                onClick={removeFromSaved}
              ></i>
            )}
          </div>
        )}
        {data.poster_path && (
          <img src={apiCtx.imagePath + data.poster_path} alt="" />
        )}
        {data.profile_path && (
          <img src={apiCtx.imagePath + data.profile_path} alt="" />
        )}
      </div>
      <div className="item-card-info">
        <div className="item-card-rating-container">
          {data.vote_average > 0 && (
            <div>
              {data.vote_average >= 7 && (
                <div className="item-rating good">
                  <span>{data.vote_average}</span>
                </div>
              )}

              {data.vote_average < 7 && data.vote_average > 4 && (
                <div className="item-rating mediocre">
                  <span>{data.vote_average}</span>
                </div>
              )}

              {data.vote_average < 4 && data.vote_average > 0 && (
                <div className="item-rating bad">
                  <span>{data.vote_average}</span>
                </div>
              )}
            </div>
          )}

          {data.vote_average === 0 && (
            <div className="item-rating">
              <span>NR</span>
            </div>
          )}
        </div>

        {data.title && data.release_date && (
          <div className="card-item-movie-info">
            <h3 className="card-item-movie-title">{data.title.slice(0, 36)}</h3>
            <p className="card-item-movie-release-date grey-text">
              {data.release_date}
            </p>
          </div>
        )}

        {data.name && data.first_air_date && (
          <div className="card-item-tv-info">
            <h3 className="card-item-tv-name">{data.name.slice(0, 36)}</h3>
            <p className="card-item-tv-first-air-date grey-text">
              {data.first_air_date}
            </p>
          </div>
        )}

        {data.name && data.character && (
          <div className="card-item-cast-item-info">
            <h3 className="card-item-cast-name">{data.name}</h3>
            <p className="card-item-cast-character grey-text">
              {data.character}
            </p>
          </div>
        )}
      </div>
    </article>
  );
};

export default Card;
