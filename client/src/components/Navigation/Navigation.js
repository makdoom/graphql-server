import React from "react";
import { NavLink } from "react-router-dom";
import "./navigation.css";

const Navigation = () => {
  return (
    <div className="navbar">
      <div className="navbar__heading">
        <h2>
          Event<span>Booker</span>
        </h2>
      </div>
      <div className="navbar__links">
        <ul>
          <li>
            <NavLink className="links" to="/auth">
              Authenticated
            </NavLink>
          </li>
          <li>
            <NavLink className="links" to="/events">
              Events
            </NavLink>
          </li>
          <li>
            <NavLink className="links" to="/bookings">
              Bookings
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navigation;
