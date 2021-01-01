import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import "./App.css";

import Auth from "./pages/Auth/Auth";
import Events from "./pages/Events/Events";
import Bookings from "./pages/Bookings/Bookings";
import Navigation from "./components/Navigation/Navigation";

function App() {
  return (
    <Router>
      <>
        <Navigation />
        <main className="main__container">
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/auth" component={Auth} />
            <Route path="/events" component={Events} />
            <Route path="/bookings" component={Bookings} />
          </Switch>
        </main>
      </>
    </Router>
  );
}

export default App;
