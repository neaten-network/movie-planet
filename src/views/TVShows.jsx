import "../css/Discover.css";
import "../css/mobile/Discover.css";
import React, { useContext, useEffect, useState } from "react";
import Card from "../components/Card";
import useFetch from "../composables/useFetch";
import ApiContext from "../context/api-context";
import SearchForm from "../components/SearchForm";
import TVGenres from "../components/TVGenres";
import Loader from "../components/Loader";

const TVShows = () => {
  const apiCtx = useContext(ApiContext);

  const [category, setCategory] = useState("popularity");
  const [searchValue, setSearchValue] = useState("");
  const [genreTag, setGenreTag] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);

  const { data, fetchData, isPending, error } = useFetch();

  // FETCH data based on category
  const getDataByCategory = () => {
    // RESET the scroll position of the page.
    if (window.scrollY) {
      window.scroll(0, 0);
    }

    switch (category) {
      case "popularity":
        setGenreTag("");
        setSearchValue("");
        fetchData(
          apiCtx.apiPopularTVShows + searchPage + "&include_adult=false"
        );
        break;
      case "thisWeek":
        setGenreTag("");
        setSearchValue("");
        fetchData(
          apiCtx.apiUpcomingTVShows + searchPage + "&include_adult=false"
        );
        break;
      case "topRated":
        setGenreTag("");
        setSearchValue("");
        fetchData(
          apiCtx.apiTopRatedTVShows + searchPage + "&include_adult=false"
        );
        break;
      case "tvSearch":
        setGenreTag("");
        fetchData(
          apiCtx.apiSearchTVShows +
            searchPage +
            `&query=${searchValue}&include_adult=false`
        );
        break;
      case "genreSearch":
        setSearchValue("");
        fetchData(
          apiCtx.apiTVGenreSearch +
            genreTag +
            `&include_adult=false&page=${searchPage}`
        );
        break;
      default:
      // do nothing
    }
  };

  // FETCH DATA by the search value
  const getSearchValue = (value) => {
    setSearchValue(value);
    if (category !== "tvSearch") {
      setCategory("tvSearch");
    }
    setGenreTag("");
  };

  // FETCH DATA by genre tag
  const getGenreId = (value) => {
    setGenreTag(value);
    if (category !== "genreSearch") {
      setCategory("genreSearch");
    }
  };

  // RESET the search value
  const handleResetSearch = (e) => {
    e.preventDefault();
    setSearchValue("");
    setCategory("popularity");
  };

  // Go to the  NEXT page
  const handleNextPage = () => {
    setSearchPage((prevValue) => prevValue + 1);
  };

  // Go to the PREVIOUS page
  const handlePrevPage = () => {
    setSearchPage((prevValue) => prevValue - 1);
  };

  // GET data & RESET searchPage to 1
  useEffect(() => {
    if (searchPage === 1) {
      getDataByCategory();
    }

    return () => {
      setSearchPage(1);
      setShowSidebar(false);
    };
  }, [category, searchValue, genreTag]);

  // GET data
  useEffect(() => {
    getDataByCategory();
    return () => {
      setShowSidebar(false);
    };
  }, [searchPage]);

  // TOGGLE sidebar visibility
  const toggleSidebar = () => {
    showSidebar ? setShowSidebar(false) : setShowSidebar(true);
  };

  return (
    <div id="discover-page">
      <div className="discover-page-container">
        <aside className={`discover-page-sidebar ${showSidebar ? "show" : ""}`}>
          <i
            className="fas fa-times toggle-sidebar-icon fa-icon-large"
            onClick={toggleSidebar}
          ></i>

          <h3 className="large-text">Popular TV Shows</h3>

          <form className="discover-category-form">
            <div className="discover-sort-category">
              <div className="discover-sort">
                <h4>Sort</h4>
              </div>

              <div className="discover-sort-by">
                <label>Sort TV Shows By</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="popularity">Popularity</option>
                  <option value="thisWeek">This Week</option>
                  <option value="topRated">Top Rated</option>

                  {genreTag && <option value="genreSearch">Genre</option>}

                  {searchValue && <option value="tvSearch">Keyword</option>}
                </select>
              </div>
            </div>

            {category === "tvSearch" && (
              <button className="btn" onClick={handleResetSearch}>
                Clear Search
              </button>
            )}
          </form>

          <h3 className="large-text">Search By Genres</h3>
          <TVGenres onTagClick={getGenreId} genreTag={genreTag} />
        </aside>

        <main>
          <div className="discover-search-container">
            <i
              className="fas fa-sliders-h toggle-sidebar-icon fa-icon-large"
              onClick={toggleSidebar}
            ></i>

            <div className="discover-search-form-container">
              {searchValue && (
                <h3 className="large-text">
                  Results for: <span className="green-text">{searchValue}</span>
                </h3>
              )}

              <SearchForm onTVSearch={getSearchValue} />
            </div>
          </div>

          <section className="discover-content-container">
            {data && (
              <div className="discover-content">
                {data.results.map((data) => (
                  <Card data={data} key={data.id} />
                ))}

                <div className="button-group">
                  {searchPage > 1 && (
                    <button className="btn" onClick={handlePrevPage}>
                      Prev Page
                    </button>
                  )}

                  {searchPage <= 1 && (
                    <button className="btn" disabled>
                      Prev Page
                    </button>
                  )}

                  {searchPage !== data.total_pages && (
                    <button className="btn" onClick={handleNextPage}>
                      Next Page
                    </button>
                  )}

                  {searchPage === data.total_pages && (
                    <button className="btn" disabled>
                      Next Page
                    </button>
                  )}
                </div>
              </div>
            )}

            {error && <div className="error">{error}</div>}

            {isPending && <Loader />}
          </section>
        </main>
      </div>
    </div>
  );
};

export default TVShows;
