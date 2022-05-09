import "../css/Home.css";
import "../css/mobile/Home.css";
import React, { useContext, useEffect, useState } from "react";
import Card from "../components/Card";
import SearchForm from "../components/SearchForm";
import Loader from "../components/Loader";
import { useHistory } from "react-router-dom";
import useFetch from "../composables/useFetch";
import ApiContext from "../context/api-context";

const Home = () => {
  const ctx = useContext(ApiContext);
  const route = useHistory();

  const [category, setCategory] = useState("movies");
  const { data, fetchData, isPending, error } = useFetch();

  // FETCH the data based on the selected category
  const getData = () => {
    if (category === "movies") {
      fetchData(ctx.apiPopularMovies + 1);
    }
    if (category === "tvShows") {
      fetchData(ctx.apiPopularTVShows + 1);
    }
  };

  // RE-FETCH when category changes
  useEffect(() => {
    getData();
  }, [category]);

  // GET the search value and redirect to the Search component
  const getValueAndRedirect = (value) => {
    route.push(`search/${value}`);
  };

  return (
    <div id="home-page">
      <div className="home-page-container">
        <header className="home-bg-container">
          <h1 className="very-large-text">Welcome.</h1>
          <h2>Millions of movies and TV shows to discover. Explore now.</h2>

          <SearchForm onMultiSearch={getValueAndRedirect} />
        </header>

        <main className="home-page-content-container">
          <div className="home-content-options">
            <h2 className="section-title">What's Popular</h2>

            <div className="home-content-categories">
              <span
                className={`home-content-category ${
                  category === "movies" ? "active" : ""
                }`}
                onClick={() => setCategory("movies")}
              >
                Movies
              </span>

              <span
                className={`home-content-category ${
                  category === "tvShows" ? "active" : ""
                }`}
                onClick={() => setCategory("tvShows")}
              >
                TV Shows
              </span>
            </div>
          </div>

          {data && (
            <div className="home-page-content">
              {data.results.map((data) => (
                <Card data={data} key={data.id} />
              ))}
            </div>
          )}

          {isPending && <Loader />}

          {error && <div className="error">{error}</div>}
        </main>

        <div className="home-bg-container large">
          <section className="home-features-container">
            <h3 className="very-large-text">Our Features:</h3>

            <ul className="home-features-list large-text">
              <li className="home-features-item">
                1. Search for Movies & TV Shows.
              </li>
              <li className="home-features-item">
                2. Search for both Movies & TV Shows in one search.
              </li>
              <li className="home-features-item">
                3. Sort Movies & TV Shows by categories & genre.
              </li>
              <li className="home-features-item">
                4. View the details & cast for a Movie or a TV Shows.
              </li>
              <li className="home-features-item">
                5. Create and Delete account.
              </li>
              <li className="home-features-item">
                6. Save Movies & TV Shows to a collection.
              </li>
              <li className="home-features-item">
                7. Write a review for a Movie or a TV Show.
              </li>
              <li className="home-features-item">
                8. Edit your saved collection(View item's details page, delete
                items from a collection).
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
