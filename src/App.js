import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./views/Home";
import Search from "./views/Search";
import Movies from "./views/Movies";
import TVShows from "./views/TVShows";
import MovieCardDetails from "./views/MovieCardDetails";
import TVCardDetails from "./views/TVCardDetails";
import UserProfile from "./views/UserProfile";
import { useContext } from "react";
import AuthContext from "./context/auth-context";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/search/:value">
              <Search />
            </Route>
            <Route exact path="/movies">
              <Movies />
            </Route>
            <Route exact path="/tv-shows">
              <TVShows />
            </Route>
            <Route exact path="/movie-details/:id">
              <MovieCardDetails />
            </Route>
            <Route exact path="/tv-show-details/:id">
              <TVCardDetails />
            </Route>
            {authCtx.contextValue.isSignedIn && (
              <Route exact path="/user-profile/:id">
                <UserProfile />
              </Route>
            )}
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
