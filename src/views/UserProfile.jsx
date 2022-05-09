import "../css/UserProfile.css";
import "../css/mobile/UserProfile.css";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/auth-context";
import useCollection from "../composables/useCollection";
import CollectionCard from "../components/CollectionCard";
import ScrollButton from "../components/ScrollButton";
import WarningModal from "../components/WarningModal";
import Loader from "../components/Loader";

const UserProfile = () => {
  const authCtx = useContext(AuthContext);

  const [showMoviesCollection, setShowMoviesCollection] = useState(true);
  const [showTVsCollection, setShowTVsCollection] = useState(false);

  const { getSavedCollection, data, error, isPending } = useCollection();

  // FETCH data
  const getData = () => {
    if (showMoviesCollection) {
      getSavedCollection("movies");
    }
    if (showTVsCollection) {
      getSavedCollection("tvs");
    }
  };

  // GET data
  useEffect(() => {
    getData();
    return () => {};
  }, [showMoviesCollection, showTVsCollection]);

  // SIGN OUT user
  const signOutHandler = () => {
    authCtx.contextValue.signOut();
  };

  // TOGGLE Movie collection visibility
  const toggleShowMovies = () => {
    showMoviesCollection
      ? setShowMoviesCollection(false)
      : setShowMoviesCollection(true);
    setShowTVsCollection(false);
  };

  // TOGGLE TV Shows collection visibility
  const toggleShowTVShows = () => {
    showTVsCollection
      ? setShowTVsCollection(false)
      : setShowTVsCollection(true);
    setShowMoviesCollection(false);
  };

  // DELETE user's firebase account
  const deleteUserAccount = async () => {
    // Firebase Key
    const firebaseApiKey = authCtx.contextValue.apiKey;
    try {
      // DELETE user account data
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${firebaseApiKey}`,
        {
          method: "POST",
          body: JSON.stringify({
            idToken: authCtx.contextValue.token,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw Error("Failed to delete account. Please try again later");
      }

      // CLOSE the showWarningModal
      authCtx.contextValue.closeWarningModal();

      // SIGN OUT after account was deleted
      authCtx.contextValue.signOut();
    } catch (err) {
      // SET error for the popup message
      authCtx.contextValue.authError(err.message);

      // AUTH ERROR popup message
      authCtx.contextValue.showPopup(`Oops, An error occurred!`);
    }
  };

  return (
    <div id="user-profile-page">
      {authCtx.contextValue.showWarningModal && (
        <WarningModal onDeleteAccount={deleteUserAccount} />
      )}

      <ScrollButton />

      <header className="user-profile">
        <div className="user-profile-container">
          <div className="user-profile-data">
            <div className="user-profile-name-email">
              <h2 className="user-profile-username very-large-text">
                {authCtx.contextValue.userDisplayName}
              </h2>

              <p className="user-profile-email">
                Signed In as{" "}
                <span className="green-text">
                  {authCtx.contextValue.userEmail}
                </span>
              </p>

              <div className="button-group">
                <button className="btn" onClick={signOutHandler}>
                  Sign Out
                </button>

                <button
                  className="btn btn-alt"
                  onClick={authCtx.contextValue.openWarningModal}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="user-profile-collections-container">
        <h2 className="section-title">My Collections</h2>
        <h3 className="green-text">View & Edit items in your collection</h3>

        <div className="user-profile-collections">
          <section id="movies" className="user-profile-collection">
            <div className="user-profile-collection-info">
              <div>
                <h3
                  className="user-profile-collection-title large-text"
                  onClick={toggleShowMovies}
                >
                  Saved Movies{" "}
                  {!showMoviesCollection && (
                    <i className="fas fa-chevron-right fa-icon expand-icon"></i>
                  )}
                  {showMoviesCollection && (
                    <i className="fas fa-chevron-down fa-icon expand-icon"></i>
                  )}
                </h3>

                <div className="tips">
                  <i className="fas fa-exclamation-circle fa-icon"></i>
                  <p>
                    All your saved Movies will be displayed below in ascending
                    order(oldest to latest).
                  </p>
                </div>
              </div>
            </div>

            {data && showMoviesCollection && (
              <div className="user-profile-collection-items">
                {data.map((data) => (
                  <CollectionCard data={data.item} key={data.item.id} />
                ))}
              </div>
            )}

            {isPending && <Loader />}

            {error && <div className="error">{error}</div>}
          </section>

          <section id="tvs" className="user-profile-collection">
            <div className="user-profile-collection-info">
              <div>
                <h3
                  className="user-profile-collection-title large-text"
                  onClick={toggleShowTVShows}
                >
                  Saved TV Shows{" "}
                  {!showTVsCollection && (
                    <i className="fas fa-chevron-right fa-icon expand-icon"></i>
                  )}
                  {showTVsCollection && (
                    <i className="fas fa-chevron-down fa-icon expand-icon"></i>
                  )}
                </h3>

                <div className="tips">
                  <i className="fas fa-exclamation-circle fa-icon"></i>
                  <p>
                    All your saved TV Shows will be displayed below in ascending
                    order(oldest to latest).
                  </p>
                </div>
              </div>
            </div>

            {data && showTVsCollection && (
              <div className="user-profile-collection-items">
                {data.map((data) => (
                  <CollectionCard data={data.item} key={data.item.id} />
                ))}
              </div>
            )}

            {isPending && <Loader />}

            {error && <div className="error">{error}</div>}
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
