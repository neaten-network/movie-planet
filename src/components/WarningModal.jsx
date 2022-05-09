import "../css/Modal.css";
import React, { useContext } from "react";
import AuthContext from "../context/auth-context";

const WarningModal = ({ onDeleteAccount }) => {
  const authCtx = useContext(AuthContext);

  // EMIT delete account function
  const deleteUserAccount = () => {
    onDeleteAccount();
  };

  return (
    <div id="warning-modal-container">
      <div className="warning-modal">
        <i
          className="fas fa-times fa-icon close-modal-icon"
          onClick={authCtx.contextValue.closeWarningModal}
        ></i>

        <h2 className="red-text large-text">Delete Account</h2>

        <div className="warning-modal-content">
          <p>
            Are you sure you want to delete your account? Once you hit the
            button, there is no going back. Please be certain about it!
          </p>
          <div className="tips">
            <i className="fas fa-exclamation-circle fa-icon"></i>
            <p>
              Warning: This process does not delete any reviews you may have
              written.
            </p>
          </div>
        </div>

        <div className="button-group">
          <button className="btn" onClick={deleteUserAccount}>
            Delete Account
          </button>

          <button
            className="btn btn-alt-dark"
            onClick={authCtx.contextValue.closeWarningModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
