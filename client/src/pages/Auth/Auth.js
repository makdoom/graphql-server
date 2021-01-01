import React from "react";
import "./auth.css";

const Auth = () => {
  return (
    <div className="auth">
      <form className="form__control">
        <h2 className="heading">Signup</h2>
        <div className="input email">
          <label htmlFor="email">Email</label>
          <br />
          <input type="email" id="email" placeholder="Email Address" />
        </div>
        <div className="input password">
          <label htmlFor="password">Password</label>
          <br />
          <input type="password" id="password" placeholder="Password" />
        </div>

        <div className="action__btn">
          <button type="submit" className="signup btn">
            Signup
          </button>
          <button type="submit" className="login btn">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
