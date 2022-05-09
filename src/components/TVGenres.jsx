import "../css/GenresSidebar.css";
import React, { useContext, useEffect } from "react";
import useFetch from "../composables/useFetch";
import ApiContext from "../context/api-context";
import Loader from "../components/Loader";

const TVGenres = (props) => {
  const apiCtx = useContext(ApiContext);

  const { data, fetchData, isPending } = useFetch();

  // FETCH data
  useEffect(() => {
    fetchData(apiCtx.apiTVGenres);
  }, []);

  return (
    <React.Fragment>
      {data && (
        <div id="search-tags">
          {data.genres.map((genre) => (
            <span
              className={`search-tag ${
                props.genreTag === genre.id ? "active" : ""
              }`}
              key={genre.id}
              onClick={() => props.onTagClick(genre.id)}
            >
              {genre.name}
            </span>
          ))}
        </div>
      )}
      {isPending && <Loader />}
    </React.Fragment>
  );
};

export default TVGenres;
