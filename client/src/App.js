import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import "./App.css";

import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";

function App() {
  return (
    <Router>
      <Switch>
        <Redirect from="/" to="/auth" exact />
        <Route path="/auth" component={Auth} />
        <Route path="/events" component={Events} />
        <Route path="/bookings" component={Bookings} />
      </Switch>
    </Router>
  );
}

export default App;
