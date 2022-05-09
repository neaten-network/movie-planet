import "../css/CardDetails.css";
import "../css/mobile/CardDetails.css";
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import useMultiFetch from "../composables/useMultiFetch";
import ApiContext from "../context/api-context";
import DetailsCard from "../components/DetailsCard";
import Loader from "../components/Loader";
import Card from "../components/Card";
import ReviewForm from "../components/ReviewForm";

const TVCardDetails = () => {
  const apiCtx = useContext(ApiContext);
  const { id } = useParams();

  const apiSingleTVShow = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiCtx.apiKey}&language=en-US`;
  const apiMovieCredits = `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiCtx.apiKey}&language=en-US`;

  const urls = [apiSingleTVShow, apiMovieCredits];

  const { dataOne, dataTwo, getMultiData, isPending, error } = useMultiFetch();

  // FETCH the data by the ID
  useEffect(() => {
    // RESET the scroll position to the top left of the document
    if (window.scrollY) {
      window.scroll(0, 0);
    }
    getMultiData(urls);
  }, []);

  return (
    <div id="card-details-page">
      {dataOne && <DetailsCard data={dataOne} />}

      <div className="card-details-page-container">
        {isPending && <Loader />}

        {error && <div className="error">{error}</div>}

        {dataTwo && (
          <section className="card-details-cast-container">
            <h2>Movie Cast</h2>
            <div className="card-details-cast">
              {dataTwo.cast.map((data) => (
                <Card data={data} key={data.id} />
              ))}
            </div>
          </section>
        )}

        <ReviewForm itemId={id} />
      </div>
    </div>
  );
};

export default TVCardDetails;
