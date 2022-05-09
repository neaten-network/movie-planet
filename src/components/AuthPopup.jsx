import "../css/AuthPopup.css";
import ReactDOM from "react-dom";
import React, { useContext } from "react";
import AuthContext from "../context/auth-context";

const PopupMessage = () => {
  const authCtx = useContext(AuthContext);

  return (
    <div
      className={`user-auth-popup ${
        authCtx.contextValue.showPopupMessage ? "show" : ""
      }`}
    >
      <div
        className={`user-auth-popup-type ${
          authCtx.contextValue.authErrorMessage ? "error" : "success"
        }`}
      >
        <h2>{authCtx.contextValue.popupMessage}</h2>

        {authCtx.contextValue.authErrorMessage && (
          <div>
            <p>{authCtx.contextValue.authErrorMessage}</p>
            {!authCtx.contextValue.isSignedIn && (
              <p>
                Tip: Please check that your password and email is entered
                correctly and try again
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const AuthPopup = () => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <PopupMessage />,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
};

export default AuthPopup;
