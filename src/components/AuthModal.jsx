import "../css/Modal.css";
import "../css/mobile/Modal.css";
import ReactDOM from "react-dom";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/auth-context";
import { useHistory } from "react-router-dom";

const Modal = () => {
  const authCtx = useContext(AuthContext);
  const route = useHistory();

  const [showSignIn, setShowSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // SWITCH between Sign In and Sign Up form
  const switchAuthMode = () => {
    setShowSignIn((prevValue) => !prevValue);
    setUsername("");
    setEmail("");
    setPassword("");
    setUsernameIsValid(false);
    setEmailIsValid(false);
    setPasswordIsValid(false);
  };

  // Input values
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Validity check states
  const [usernameIsValid, setUsernameIsValid] = useState(false);
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [signInFormIsValid, setSignInFormIsValid] = useState(false);
  const [signUpFormIsValid, setSignUpFormIsValid] = useState(false);

  const validRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;

  // CHECK form validity
  const checkFormIsValid = () => {
    // CHECK if the username is valid
    if (username !== "" && username.length >= 4) {
      setUsernameIsValid(true);
    } else {
      setUsernameIsValid(false);
    }
    // CHECK if the email is valid
    if (email !== "" && email.match(validRegex)) {
      setEmailIsValid(true);
    } else {
      setEmailIsValid(false);
    }
    // CHECK if the password is valid
    if (password !== "" && password.length >= 6) {
      setPasswordIsValid(true);
    } else {
      setPasswordIsValid(false);
    }
  };

  useEffect(() => {
    // CHECK form validation if user stoped typing
    const timeout = setTimeout(() => {
      checkFormIsValid();
    }, 1000);

    // CLEAR timeout
    return () => clearTimeout(timeout);
  }, [username, email, password]);

  useEffect(() => {
    // CHECK if all fields are valid for sign up
    if (usernameIsValid && emailIsValid && passwordIsValid) {
      setSignUpFormIsValid(true);
    } else if (!usernameIsValid || !emailIsValid || !passwordIsValid) {
      setSignUpFormIsValid(false);
    }

    // CHECK if all fields are valid for sign in
    if (emailIsValid && passwordIsValid) {
      setSignInFormIsValid(true);
    } else if (!emailIsValid || !passwordIsValid) {
      setSignInFormIsValid(false);
    }
  }, [usernameIsValid, emailIsValid, passwordIsValid]);

  // SIGN UP/IN the user with email and password
  const authFormSubmitHandler = async (e) => {
    e.preventDefault();

    const enteredUsername = !showSignIn ? username.trim() : "";
    const enteredEmail = email.trim();
    const enteredPassword = password.trim();

    // Button loading status
    setIsLoading(true);

    // Firebase Key
    const firebaseApiKey = authCtx.contextValue.apiKey;
    let url;
    if (showSignIn) {
      // SIGN IN url
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`;
    } else {
      // SIGN Up url
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseApiKey}`;
    }
    // FETCH data
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          displayName: !showSignIn ? enteredUsername : "",
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // CHECK request status
      if (!response.ok) {
        throw Error("Authentication failed!");
      }

      const data = await response.json();
      setIsLoading(false);
      authCtx.contextValue.authError("");

      // console.log(data);

      // GET token expiration time in miliseconds
      const expirationTime = new Date(
        new Date().getTime() + +data.expiresIn * 1000
      );

      // SIGN IN a user with the data from fetch
      authCtx.contextValue.signIn(
        data.idToken,
        expirationTime.toISOString(),
        data.displayName,
        data.email,
        data.localId
      );

      // REDIRECT & SHOW popup when successfully signed up
      if (!showSignIn) {
        route.push(`/user-profile/${data.localId}`);
        // SIGN Up popup message
        authCtx.contextValue.showPopup(`You've been successfully signed up!`);
      }

      // SIGN IN popup message
      if (showSignIn) {
        authCtx.contextValue.showPopup(`You've been successfully signed in!`);
      }
    } catch (err) {
      authCtx.contextValue.authError(err.message);
      // AUTH ERROR popup message
      authCtx.contextValue.showPopup(`Oops, An error occurred!`);
      setIsLoading(false);
    }
  };

  return (
    <div id="auth-modal-container">
      <div className="auth-modal">
        <i
          className="fas fa-times fa-icon close-modal-icon"
          onClick={authCtx.contextValue.closeAuthModal}
        ></i>

        <form className="auth-modal-form" onSubmit={authFormSubmitHandler}>
          {showSignIn && <h2 className="very-large-text">Sign In</h2>}

          {!showSignIn && <h2 className="very-large-text">Sign Up</h2>}

          {!showSignIn && (
            <div className="auth-modal-input-tips-group">
              <div
                className={`tips grey-text ${usernameIsValid ? "checked" : ""}`}
              >
                {!showSignIn && usernameIsValid && (
                  <i className="fas fa-check fa-icon"></i>
                )}
                {!showSignIn && !usernameIsValid && (
                  <i className="fas fa-exclamation-circle fa-icon"></i>
                )}
                <p>Username must be at least 4 chars</p>
              </div>

              <input
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          <div className="auth-modal-input-tips-group">
            <div className={`tips grey-text ${emailIsValid ? "checked" : ""}`}>
              {emailIsValid && <i className="fas fa-check fa-icon"></i>}
              {!emailIsValid && (
                <i className="fas fa-exclamation-circle fa-icon"></i>
              )}
              <p>Email must follow the example below</p>
            </div>

            <input
              type="email"
              placeholder="name@mail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-modal-input-tips-group">
            <div
              className={`tips grey-text ${passwordIsValid ? "checked" : ""}`}
            >
              {passwordIsValid && <i className="fas fa-check fa-icon"></i>}
              {!passwordIsValid && (
                <i className="fas fa-exclamation-circle fa-icon"></i>
              )}
              <p>Password must be at least 6 chars</p>
            </div>

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="auth-modal-buttons-container">
            {showSignIn && !isLoading && signInFormIsValid && (
              <button className="btn">Sign In</button>
            )}

            {showSignIn && !isLoading && !signInFormIsValid && (
              <button className="btn" disabled>
                Sign In
              </button>
            )}

            {!showSignIn && !isLoading && signUpFormIsValid && (
              <button className="btn">Sign Up</button>
            )}

            {!showSignIn && !isLoading && !signUpFormIsValid && (
              <button className="btn" disabled>
                Sign Up
              </button>
            )}

            {isLoading && (
              <button className="btn" disabled>
                Processing...
              </button>
            )}
          </div>

          <div className="auth-modal-auth-type-message">
            {showSignIn && (
              <p className="auth-modal-switch">
                No account yet? <span onClick={switchAuthMode}>Sign Up</span>{" "}
                instead.
              </p>
            )}

            {!showSignIn && (
              <p className="auth-modal-switch">
                Have an account already?{" "}
                <span onClick={switchAuthMode}>Sign In</span> instead.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const AuthModal = () => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Modal />,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
};

export default AuthModal;
