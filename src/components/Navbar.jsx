import "../css/Navbar.css";
import "../css/mobile/Navbar.css";
import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import AuthModal from "./AuthModal";
import AuthContext from "../context/auth-context";
import AuthPopup from "./AuthPopup";

const Navbar = () => {
  const authCtx = useContext(AuthContext);
  const [showNavSlider, setShowNavSlider] = useState(false);

  const isSignedIn = authCtx.contextValue.isSignedIn;
  const userId = authCtx.contextValue.userId;

  // SIGN OUT user
  const signOutHandler = () => {
    authCtx.contextValue.signOut();
    setShowNavSlider(false);
  };

  // TOGGLE nav slider visibility
  const toggleNavSlider = () => {
    showNavSlider ? setShowNavSlider(false) : setShowNavSlider(true);
  };

  // CLOSE nav slider if a link was clicked
  const closeNavSlider = (e) => {
    if (e.target.classList.contains("navbar-link")) {
      setShowNavSlider(false);
    }
  };

  return (
    <React.Fragment>
      <nav id="navbar">
        <div className="navbar-container">
          <div className="navbar-left-block">
            <h3 className="logo">
              MoviePlanet<i className="fas fa-meteor fa-icon"></i>
            </h3>

            <div className="navbar-links">
              <NavLink
                to="/"
                exact={true}
                className="navbar-link"
                activeClassName="active-route"
              >
                Home
              </NavLink>

              <NavLink
                to="/movies"
                exact={true}
                className="navbar-link"
                activeClassName="active-route"
              >
                Movies
              </NavLink>

              <NavLink
                to="/tv-shows"
                exact={true}
                className="navbar-link"
                activeClassName="active-route"
              >
                TV Shows
              </NavLink>
            </div>
          </div>
          <div className="navbar-right-block">
            {!isSignedIn && (
              <button
                className="btn"
                onClick={authCtx.contextValue.openAuthModal}
              >
                Sign In
              </button>
            )}

            {isSignedIn && (
              <div className="navbar-user">
                <NavLink
                  to={`/user-profile/${userId}`}
                  exact={true}
                  className="navbar-link navbar-account-link"
                  activeClassName="active-route"
                >
                  {authCtx.contextValue.userDisplayName}
                </NavLink>

                <button className="btn btn-alt" onClick={signOutHandler}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* NAVBAR SLIDER */}
        <div className="navbar-slider">
          <div className="navbar-slider-logo-toggle-icon">
            <h3 className="logo">
              MoviePlanet<i className="fas fa-meteor fa-icon"></i>
            </h3>

            <i
              className={`fas fa-sliders-h toggle-nav-icon fa-icon-large ${
                showNavSlider ? "active" : ""
              }`}
              onClick={toggleNavSlider}
            ></i>
          </div>

          <div
            className={`navbar-slider-container ${showNavSlider ? "show" : ""}`}
            onClick={closeNavSlider}
          >
            <div className="navbar-slider-links">
              <NavLink
                to="/"
                exact={true}
                className="navbar-link"
                activeClassName="active-route"
              >
                Home
              </NavLink>

              <NavLink
                to="/movies"
                exact={true}
                className="navbar-link"
                activeClassName="active-route"
              >
                Movies
              </NavLink>

              <NavLink
                to="/tv-shows"
                exact={true}
                className="navbar-link"
                activeClassName="active-route"
              >
                TV Shows
              </NavLink>
            </div>

            <div className="navbar-slider-account">
              {!isSignedIn && (
                <button
                  className="btn"
                  onClick={authCtx.contextValue.openAuthModal}
                >
                  Sign In
                </button>
              )}

              {isSignedIn && (
                <div className="navbar-user">
                  <NavLink
                    to={`/user-profile/${userId}`}
                    exact={true}
                    className="navbar-link navbar-account-link"
                    activeClassName="active-route"
                  >
                    {authCtx.contextValue.userDisplayName}
                  </NavLink>

                  <button className="btn btn-alt" onClick={signOutHandler}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {authCtx.contextValue.showAuthModal && <AuthModal />}

      <AuthPopup />
    </React.Fragment>
  );
};

export default Navbar;
