import "./App.css";
import Board from "./views/Board";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function App() {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isLogin = useSelector((state) => state?.app?.login ?? false);

  const dispatch = useDispatch()

  // User Login info
  const database = [
    {
      username: "user1",
      password: "pass1",
    },
    {
      username: "user2",
      password: "pass2",
    },
  ];

  const errors = {
    uname: "invalid username",
    pass: "invalid password",
  };

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];

    // Find user login info
    const userData = database.find((user) => user.username === uname.value);

    // Compare user info
    if (userData) {
      if (userData.password !== pass.value) {
        // Invalid password
        setErrorMessages({ name: "pass", message: errors.pass });
      } else {
        dispatch({
          type: "SET_APP",
          payload: (prev = {}) => ({
            ...(prev ?? {}),
            userScore: 10,
          }),
        });

        dispatch({
          type: "SET_APP",
          payload: (prev = {}) => ({
            ...(prev ?? {}),
            login: true,
          }),
        });
        setIsSubmitted(true);
      }
    } else {
      // Username not found
      setErrorMessages({ name: "uname", message: errors.uname });
    }
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <>
      <div className="title">Sign In</div>
      <div className="form">
        <form onSubmit={handleSubmit}>
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
          <div className="button-container">
            <input type="submit" />
          </div>
        </form>
      </div>
    </>
  );

  return (
    <div className="app">
      {isLogin || isSubmitted ? <Board /> : <div className="login-form">{renderForm}</div>}
    </div>
  );
}

export default App;
