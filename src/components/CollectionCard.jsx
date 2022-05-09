import "../css/CollectionCard.css";
import "../css/mobile/CollectionCard.css";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { projectFirestore } from "../firebase/firebase-config";
import ApiContext from "../context/api-context";
import AuthContext from "../context/auth-context";

const CollectionCard = ({ data }) => {
  const apiCtx = useContext(ApiContext);
  const authCtx = useContext(AuthContext);
  const route = useHistory();

  const bookmarkedItemId = data.id.toString();

  // REMOVE item from firestore database
  const removeFromSaved = async () => {
    let subCollectionName;
    if (data.title) {
      subCollectionName = "movies";
    }
    if (data.name) {
      subCollectionName = "tvs";
    }
    if (subCollectionName) {
      await projectFirestore
        .collection("users")
        .doc(authCtx.contextValue.userId)
        .collection(subCollectionName)
        .doc(bookmarkedItemId)
        .delete();
    }
  };

  // Handle movie title click
  const handleMovieClick = () => {
    route.push(`/movie-details/${data.id}`);
  };
  // Handle tv show title click
  const handleTVClick = () => {
    route.push(`/tv-show-details/${data.id}`);
  };

  return (
    <article id="collection-card">
      <i
        className="fas fa-trash fa-icon delete-item-icon"
        onClick={removeFromSaved}
      ></i>
      <div className="collection-card-image-container">
        {data.poster_path && (
          <img src={apiCtx.imagePath + data.poster_path} alt="" />
        )}
      </div>
      <div className="collection-card-info-container">
        {data.title && data.release_date && (
          <div>
            <h3 className="collection-card-title" onClick={handleMovieClick}>
              {data.title}
            </h3>
            <p className="collection-card-release-date grey-text">
              {data.release_date}
            </p>
            <p className="collection-card-overview">
              {data.overview.slice(0, 130)}...
            </p>
          </div>
        )}
        {data.name && data.first_air_date && (
          <div>
            <h3 className="collection-card-name" onClick={handleTVClick}>
              {data.name}
            </h3>
            <p className="collection-card-first-air-date grey-text">
              {data.first_air_date}
            </p>
            <p className="collection-card-overview">
              {data.overview.slice(0, 130)}...
            </p>
          </div>
        )}
      </div>
    </article>
  );
};

export default CollectionCard;
