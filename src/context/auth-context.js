import React, { useEffect, useState, useCallback } from "react";

const AuthContext = React.createContext({});

let signOutTimer;

// CALCULATE remaning time before token expiration
const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjustedExpirationTime = new Date(expirationTime).getTime();

  const remainingTime = adjustedExpirationTime - currentTime;

  return remainingTime;
};

// RETRIEVE token, displayName and email if expiraion time did not expired
const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");
  const storedDisplayName = localStorage.getItem("displayName");
  const storedEmail = localStorage.getItem("email");
  const storedId = localStorage.getItem("userId");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  // CLEAR localStorage
  if (remainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("displayName");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
    displayName: storedDisplayName,
    email: storedEmail,
    id: storedId,
  };
};

export const AuthContextProvider = (props) => {
  const apiKey = "AIzaSyBUdFiNoQz3cXwp47bLh5WdgywYTt5XY8Q";
  const tokenData = retrieveStoredToken();
  // Initial values retrieved from localStorage to prevent logout and user data loss on page refresh
  let initialToken;
  let initialDisplayName;
  let initialEmail;
  let initialId;

  if (tokenData) {
    initialToken = tokenData.token;
    initialDisplayName = tokenData.displayName;
    initialEmail = tokenData.email;
    initialId = tokenData.id;
  }
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showPopupMessage, setShowPopupMessage] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [authErrorMessage, setAuthErrorMessage] = useState();
  // User data
  const [token, setToken] = useState(initialToken);
  const [userDisplayName, setUserDisplayName] = useState(initialDisplayName);
  const [userEmail, setUserEmail] = useState(initialEmail);
  const [userId, setUserId] = useState(initialId);

  // Value to check if the user is signed in
  const userIsSignedIn = !!token;

  // OPEN auth modal
  const openAuthModal = () => {
    setShowAuthModal(true);
  };

  // CLOSE auth modal
  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  // OPEN warning modal
  const openWarningModal = () => {
    setShowWarningModal(true);
  };

  // CLOSE warning modal
  const closeWarningModal = () => {
    setShowWarningModal(false);
  };

  // SIGN OUT the user
  const signOutHandler = useCallback(() => {
    // CLEAR useStates values
    setToken(null);
    setUserDisplayName("");
    setUserEmail("");
    setUserId("");

    // CLEAR localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("displayName");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");

    // CLEAR token expiration timeout if user has manually signed out
    if (signOutTimer) {
      clearTimeout(signOutTimer);
    }

    // SHOW the message popup
    setAuthErrorMessage("");
    showPopup(`You've been successfully signed out!`);
  }, []);

  // SIHN IN the user & CALL signOutHandler if token expiration time has expired
  const signInHandler = (token, expirationTime, displayName, email, id) => {
    // SET userStates values when data from the fetch is given
    setToken(token);
    setUserDisplayName(displayName);
    setUserEmail(email);
    setUserId(id);

    // STORE data from fetch into localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);
    localStorage.setItem("displayName", displayName);
    localStorage.setItem("email", email);
    localStorage.setItem("userId", id);

    // CALL signOutHandler if token expiration time has expired
    const remainingTime = calculateRemainingTime(expirationTime);
    signOutTimer = setTimeout(signOutHandler, remainingTime);

    closeAuthModal();
  };

  // CALL signOutHandler if token expiration time has expired
  useEffect(() => {
    if (tokenData) {
      // console.log(tokenData.duration);
      signOutTimer = setTimeout(signOutHandler, tokenData.duration);
    }
  }, [tokenData, signOutHandler]);

  // SHOW the popup message
  const showPopup = (message) => {
    setPopupMessage(message);
    setShowPopupMessage(true);
    // HIDE the popup message after 3.5 seconds
    setTimeout(() => {
      setShowPopupMessage(false);
    }, 3500);
  };

  const contextValue = {
    apiKey: apiKey,
    token: token,
    showAuthModal: showAuthModal,
    showWarningModal: showWarningModal,
    showPopupMessage: showPopupMessage,
    isSignedIn: userIsSignedIn,
    userDisplayName: userDisplayName,
    userEmail: userEmail,
    userId: userId,
    popupMessage: popupMessage,
    authErrorMessage: authErrorMessage,
    authError: setAuthErrorMessage,
    showPopup: showPopup,
    openAuthModal: openAuthModal,
    closeAuthModal: closeAuthModal,
    openWarningModal: openWarningModal,
    closeWarningModal: closeWarningModal,
    signIn: signInHandler,
    signOut: signOutHandler,
  };

  return (
    <AuthContext.Provider value={{ contextValue }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
