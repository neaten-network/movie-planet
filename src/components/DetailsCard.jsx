import "../css/DetailsCard.css";
import "../css/mobile/DetailsCard.css";
import React, { useContext, useState, useEffect } from "react";
import { projectFirestore, timestamp } from "../firebase/firebase-config";
import ApiContext from "../context/api-context";
import AuthContext from "../context/auth-context";

const DetailsCard = ({ data }) => {
  const apiCtx = useContext(ApiContext);
  const authCtx = useContext(AuthContext);

  const [bookmarked, setBookmarked] = useState(false);

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
  }, [authCtx.contextValue.userId, subCollectionName]);

  return (
    <article id="details-card">
      <img
        src={apiCtx.imagePath + data.poster_path}
        alt=""
        className="details-card-bg"
      />

      <div className="details-card-container">
        <div className="details-card-item-image">
          {data.poster_path && (
            <img src={apiCtx.imagePath + data.poster_path} alt="" />
          )}
        </div>

        <div className="details-card-item-description">
          {data.title && (
            <h2 className="details-card-item-title very-large-text">
              {data.title}
            </h2>
          )}

          {data.name && (
            <h2 className="details-card-item-name very-large-text">
              {data.name}
            </h2>
          )}

          <div className="details-card-item-genres-date-duration">
            {data.release_date && (
              <p className="details-card-item-release-date">
                Release Date:{" "}
                <span className="green-text">{data.release_date}</span>
              </p>
            )}

            {data.last_air_date && (
              <p className="details-card-item-last-air-date">
                Last Air Date:{" "}
                <span className="green-text">{data.last_air_date}</span>
              </p>
            )}

            <div className="details-card-dot-separator"></div>

            <div className="details-card-item-genres">
              <p>Genres:</p>{" "}
              {data.genres.map((genre, index) => (
                <span
                  className="details-card-item-genre green-text"
                  key={genre.id}
                >
                  {index > 0 && ", "}
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="details-card-dot-separator"></div>

            {data.runtime && (
              <p className="details-card-item-duration">
                Duration: <span className="green-text">{data.runtime}min</span>
              </p>
            )}

            {data.number_of_seasons && (
              <p className="details-card-item-seasons">
                Seasons:{" "}
                <span className="green-text">{data.number_of_seasons}</span>
              </p>
            )}
          </div>

          <div className="details-card-item-rating-bookmark">
            <div>
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
                <div className="item-rating nr">
                  <span>NR</span>
                </div>
              )}
            </div>
            <div>
              {!bookmarked && (
                <div
                  className="details-card-item-bookmark-icon"
                  onClick={addToSaved}
                >
                  <i className="far fa-bookmark fa-icon"></i>
                </div>
              )}

              {bookmarked && (
                <div
                  className="details-card-item-bookmark-icon checked"
                  onClick={removeFromSaved}
                >
                  <i className="fas fa-bookmark fa-icon"></i>
                </div>
              )}
            </div>

            {data.homepage && (
              <div className="details-card-item-homepage">
                <a href={data.homepage} target="_blank" className="btn btn-alt">
                  Watch Trailer
                </a>
              </div>
            )}
          </div>

          <p className="details-card-tag-line green-text">{data.tagline}</p>

          <div className="details-card-item-overview">
            <h3 className="details-card-item-subtitle">Overview</h3>
            <p>{data.overview}</p>
          </div>

          <div className="details-card-item-additional-info">
            {data.production_companies && (
              <div className="details-card-item-production_companies">
                <h3 className="details-card-item-subtitle">
                  Production Companies
                </h3>
                {data.production_companies.map((company) => (
                  <p
                    className="green-text details-card-item-production_company"
                    key={company.id}
                  >
                    {company.name}
                  </p>
                ))}
              </div>
            )}

            {data.created_by && (
              <div className="details-card-item-created-by">
                <h3 className="details-card-item-subtitle">Created By</h3>
                {data.created_by.map((creator) => (
                  <p
                    className="green-text details-card-item-creator"
                    key={creator.id}
                  >
                    {creator.name}
                  </p>
                ))}
              </div>
            )}

            {data.networks && (
              <div className="details-card-item-networks">
                <h3 className="details-card-item-subtitle">Networks</h3>
                {data.networks.map((network) => (
                  <p
                    className="green-text details-card-item-network"
                    key={network.id}
                  >
                    {network.name}
                  </p>
                ))}
              </div>
            )}

            <div className="details-card-item-status">
              <h3 className="details-card-item-subtitle">Status</h3>
              <p className="green-text">{data.status}</p>
            </div>

            {data.budget && data.budget !== 0 && (
              <div className="details-card-item-budget">
                <h3 className="details-card-item-subtitle">Movie Budget</h3>
                <p className="green-text">{data.budget}$</p>
              </div>
            )}

            {data.revenue && data.revenue !== 0 && (
              <div className="details-card-item-revenue">
                <h3 className="details-card-item-subtitle">Movie Revenue</h3>
                <p className="green-text">{data.revenue}$</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default DetailsCard;
