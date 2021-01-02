import React, { useState } from "react";
import "./auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  //  handle change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const toggleLogin = () => {
    setIsLogin((prevState) => !prevState);
    setUser({ email: "", password: "" });
  };
  // handle submti
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.email.trim().length === 0 || user.password.trim().length === 0)
      return;

    const requestBod = {
      // !FIXME:
      query: `
        query {
          login(userInput: {email:"${user.email}", password: "${user.password}"}){
            _id 
            email
          }
        }
      `,
    };

    const requestBody = {
      query: `
        mutation {
          createUser(userInput: {email:"${user.email}", password: "${user.password}"}){
            _id 
            email
          }
        }
      `,
    };
    const response = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, errors } = await response.json();
    console.log(data, errors);
  };

  return (
    <div className="auth">
      <form className="form__control" onSubmit={handleSubmit}>
        <h2 className="heading">{isLogin ? "Login" : "Signup"}</h2>
        <div className="input email">
          <label htmlFor="email">Email</label>
          <br />
          <input
            name="email"
            type="email"
            id="email"
            placeholder="Email Address"
            value={user.email}
            onChange={handleChange}
          />
        </div>
        <div className="input password">
          <label htmlFor="password">Password</label>
          <br />
          <input
            name="password"
            type="password"
            id="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
          />
        </div>

        <div className="action__btn">
          <button type="submit" className="signup btn">
            {isLogin ? "Login" : "Signup"}
          </button>
          <button type="submit" className="login btn" onClick={toggleLogin}>
            {isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
