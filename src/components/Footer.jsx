import "../css/Footer.css";
import "../css/mobile/Footer.css";
import React from "react";
import reactLogo from "../images/react-logo.png";
import firebaseLogo from "../images/firebase-logo.png";
import tmdbLogo from "../images/tmdb-logo.svg";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="footer-container">
        <h3 className="logo">
          MoviePlanet<i className="fas fa-meteor fa-icon"></i>
        </h3>
        <div className="footer-tools">
          <img src={reactLogo} alt="react-logo" />
          <img src={firebaseLogo} alt="firebase-logo" />
          <img src={tmdbLogo} alt="tmdb-logo" className="tmdb-logo" />
        </div>
        <p className="footer-credits">
          Created by{" "}
          <a
            href="https://sergey-zavatyi-portfolio.netlify.app/"
            target="_blank"
            className="portfolio-link"
          >
            Sergey Zavatyi
          </a>
          , Powered by TMDB API & Firebase, Color palette by TMDB
        </p>
      </div>
    </footer>
  );
};

export default Footer;
