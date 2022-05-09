import "../css/Search.css";
import "../css/mobile/Search.css";
import React, { useContext, useEffect, useState } from "react";
import useFetch from "../composables/useFetch";
import { useParams } from "react-router-dom";
import ApiContext from "../context/api-context";
import Card from "../components/Card";
import SearchForm from "../components/SearchForm";
import Loader from "../components/Loader";

const Search = () => {
  const apiCtx = useContext(ApiContext);
  const { value } = useParams();

  const [searchPage, setSearchPage] = useState(1);
  const [searchValue, setSearchValue] = useState(value);
  const { data, fetchData, isPending, error } = useFetch();

  // FETCH the data based on the search value
  useEffect(() => {
    // RESET the scroll position to the top left of the document.
    if (window.scrollY) {
      window.scroll(0, 0);
    }
    fetchData(apiCtx.apiMultiSearch + searchValue + `&page=${searchPage}`);
    return () => {};
  }, [searchPage]);

  useEffect(() => {
    // RESET the scroll position to the top left of the document.
    if (window.scrollY) {
      window.scroll(0, 0);
    }
    fetchData(apiCtx.apiMultiSearch + searchValue + `&page=${searchPage}`);
    return () => {
      setSearchPage(1);
    };
  }, [searchValue]);

  // FETCH based on search value
  const getValueAndFetch = (value) => {
    setSearchValue(value);
  };

  return (
    <div id="search-results-page">
      <div className="search-results-page-container">
        <header>
          <SearchForm onMultiSearch={getValueAndFetch} />

          {value && (
            <h3 className="search-results-keyword large-text">
              Search results for:{" "}
              <span className="green-text">{searchValue}</span>
            </h3>
          )}

          <div className="tips">
            <i className="fas fa-exclamation-circle fa-icon"></i>
            <p>
              For more specific search results visit Movies or TV Shows page.
            </p>
          </div>
        </header>

        <main>
          {data && (
            <div className="search-results-content">
              {data.results.map((data) => (
                <Card data={data} key={data.id} />
              ))}

              <div className="button-group">
                {searchPage > 1 && (
                  <button
                    className="btn"
                    onClick={() => setSearchPage(searchPage - 1)}
                  >
                    Prev Page
                  </button>
                )}

                {searchPage <= 1 && (
                  <button className="btn" disabled>
                    Prev Page
                  </button>
                )}

                {searchPage !== data.total_pages && (
                  <button
                    className="btn"
                    onClick={() => setSearchPage(searchPage + 1)}
                  >
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

          {isPending && <Loader />}

          {error && <div className="error">{error}</div>}
        </main>
      </div>
    </div>
  );
};

export default Search;
