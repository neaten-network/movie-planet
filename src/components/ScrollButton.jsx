import React from "react";

const ScrollButton = () => {
  const resetPageScroll = () => {
    if (window.scrollY) {
      window.scroll(0, 0);
    }
  };

  return (
    <button className="btn scroll-btn" onClick={resetPageScroll}>
      <i className="fas fa-chevron-up fa-icon"></i>
    </button>
  );
};

export default ScrollButton;
