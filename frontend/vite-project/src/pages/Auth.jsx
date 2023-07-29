import React, { Component, useContext } from "react";

import "./Auth.css";
import authContext from "../components/context/auth-context";

class AuthPage extends Component {
  state = {
    isLogin: true,
  };
  static contextType = authContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!){
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password,
      },
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!){
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email, // key - value pair
          password: password,
        },
      };
    }

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          alert("Incorrect Credentials!!");
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
            // alert('User has been Signed in Successfully')
          );
        }
      })
      .catch((err) => {
        // alert('User has been Registered Successfully!!')
        console.log(err);
      });
  };

  render() {
    return (
      <section className="auth-section">
        <form className="auth-form" onSubmit={this.submitHandler}>
          <h2 className="login-heading">{this.state.isLogin ? "Login" : "Signup"}</h2>
          <div className="form-control">
            <label htmlFor="email" className="email">
              E-Mail
            </label>
            <input type="email" id="email" placeholder="Email" ref={this.emailEl} />
          </div>
          <div className="form-control">
            <label htmlFor="password" className="password">
              Password
            </label>
            <input type="password" id="password" placeholder="Password" ref={this.passwordEl} />
          </div>
          <div className="form-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={this.switchModeHandler}>
              Switch to {this.state.isLogin ? "Signup" : "Login"}
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default AuthPage;
