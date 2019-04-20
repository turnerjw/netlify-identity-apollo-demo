import React, { Component } from "react";
import netlifyIdentity from "netlify-identity-widget";
import logo from "./logo.svg";
import "./App.css";

const netlifyAuth = {
    isAuthenticated: false,
    user: null,
    authenticate(callback) {
        this.isAuthenticated = true;
        netlifyIdentity.open();
        netlifyIdentity.on("login", user => {
            this.user = user;
            callback(user);
        });
    },
    signout(callback) {
        this.isAuthenticated = false;
        netlifyIdentity.logout();
        netlifyIdentity.on("logout", () => {
            this.user = null;
            callback();
        });
    }
};

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                    <button onClick={() => netlifyIdentity.open()}>
                        Login
                    </button>
                </header>
            </div>
        );
    }
}

export default App;
