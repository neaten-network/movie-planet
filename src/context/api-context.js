import React from "react";

const ApiContext = React.createContext({});

export const ApiContextProvider = (props) => {
  // API Urls
  const apiKey = "166bc2f4f87cb9d955c1caf450a7faea";
  const imagePath = "https://image.tmdb.org/t/p/original/";
  const apiPopularMovies = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=`;
  const apiUpcomingMovies = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=`;
  const apiTopRatedMovies = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=`;
  const apiSearchMovies = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;
  const apiMovieGenres = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;
  const apiPopularTVShows = `https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=${apiKey}&page=`;
  const apiUpcomingTVShows = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}&language=en-US&page=`;
  const apiTopRatedTVShows = `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=en-US&page=`;
  const apiSearchTVShows = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=en-US&page=`;
  const apiTVGenres = `https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=en-US`;
  const apiMultiSearch = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&query=`;
  const apiMovieGenreSearch = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=`;
  const apiTVGenreSearch = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=`;

  return (
    <ApiContext.Provider
      value={{
        apiKey: apiKey,
        imagePath: imagePath,
        apiPopularMovies: apiPopularMovies,
        apiUpcomingMovies: apiUpcomingMovies,
        apiTopRatedMovies: apiTopRatedMovies,
        apiSearchMovies: apiSearchMovies,
        apiMovieGenres: apiMovieGenres,
        apiPopularTVShows: apiPopularTVShows,
        apiUpcomingTVShows: apiUpcomingTVShows,
        apiTopRatedTVShows: apiTopRatedTVShows,
        apiSearchTVShows: apiSearchTVShows,
        apiTVGenres: apiTVGenres,
        apiMultiSearch: apiMultiSearch,
        apiMovieGenreSearch: apiMovieGenreSearch,
        apiTVGenreSearch: apiTVGenreSearch,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

export default ApiContext;
