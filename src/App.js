import "./App.css";
import Board from "./views/Board";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { config } from "./constant";

function App() {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSignUp, setIsSignUp] = useState(false);
  const isLogin = useSelector((state) => state?.app?.login ?? false);

  const dispatch = useDispatch();

  const errors = {
    uname: "invalid username",
    pass: "invalid password",
  };

  const handleSignIn = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];
    
    // Find user login info
    axios
      .post(`${config.BackendBaseURL}signIn-user`, {
        name: uname.value,
        pwd: pass.value
      })
      .then((response) => {
        const result = response.data;
        // Compare user info
        if (!result.success) {
          if (result.errCode === 1) {
            // Username not found
            setErrorMessages({ name: "uname", message: errors.uname });
          } else {
            // invalid password
            setErrorMessages({ name: "pass", message: errors.pass });
          }
        } else {
          dispatch({
            type: "SET_APP",
            payload: (prev = {}) => ({
              ...(prev ?? {}),
              userName: uname.value,
            }),
          });

          dispatch({
            type: "SET_APP",
            payload: (prev = {}) => ({
              ...(prev ?? {}),
              userScore: result.score,
            }),
          });

          dispatch({
            type: "SET_APP",
            payload: (prev = {}) => ({
              ...(prev ?? {}),
              login: true,
            }),
          });
          setErrorMessages({});
        }
      });
  };

  const handleSignUp = (event) => {
    event.preventDefault();
    var { uname, pass } = document.forms[0];

    axios
      .post(`${config.BackendBaseURL}/signUp-user`, {
        name: uname.value,
        pwd: pass.value,
      })
      .then((response) => {
        const result = response.data;
        // Compare user info
        if (!result.success) {
          setErrorMessages({ name: "uname", message: errors.uname });
        } else {
          setIsSignUp(false);
        }
      });
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const signInForm = (
    <>
      <div className="title">Sign In</div>
      <div className="form">
        <form onSubmit={handleSignIn}>
          <div className="input-container">
            <label>Username </label>
            <input type="text" name="uname" required />
            {renderErrorMessage("uname")}
          </div>
          <div className="input-container">
            <label>Password </label>
            <input type="password" name="pass" required />
            {renderErrorMessage("pass")}
          </div>
          <div className="sign-container">
            <label
              style={{ cursor: "pointer" }}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </label>
          </div>
          <div className="button-container">
            <input type="submit" />
          </div>
        </form>
      </div>
    </>
  );

  // JSX code for login form
  const signUpForm = (
    <>
      <div className="title">Sign Up</div>
      <div className="form">
        <form onSubmit={handleSignUp}>
          <div className="input-container">
            <label>Username </label>
            <input type="text" name="uname" required />
            {renderErrorMessage("uname")}
          </div>
          <div className="input-container">
            <label>Password </label>
            <input type="password" name="pass" required />
          </div>
          <div className="sign-container">
            <label
              style={{ cursor: "pointer" }}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </label>
          </div>
          <div className="button-container">
            <input type="submit" />
          </div>
        </form>
      </div>
    </>
  );

  return (
    <div className="app">
      {isLogin ? (
        <Board />
      ) : isSignUp ? (
        <div className="login-form">{signUpForm}</div>
      ) : (
        <div className="login-form">{signInForm}</div>
      )}
    </div>
  );
}

export default App;
