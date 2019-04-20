import React, { useState } from "react";
import netlifyIdentity from "netlify-identity-widget";
import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import logo from "./logo.svg";
import "./App.css";

const client = new ApolloClient({
    uri: "/.netlify/functions/apollo",
    request: async operation => {
        if (netlifyIdentity.currentUser()) {
            const token = await netlifyIdentity.currentUser().jwt();
            operation.setContext({
                headers: {
                    authorization: token ? `Bearer ${token}` : ""
                }
            });
        }
    }
});

const helloQuery = gql`
    {
        hello
    }
`;

function LambdaDemo() {
    return (
        <ApolloProvider client={client}>
            <Query query={helloQuery}>
                {({ data, loading, refetch }) => {
                    netlifyIdentity.on("login", () => refetch());
                    netlifyIdentity.on("logout", () => refetch());
                    return (
                        <div>
                            A greeting from the server:{" "}
                            {loading ? "loading" : data.hello}
                        </div>
                    );
                }}
            </Query>
        </ApolloProvider>
    );
}

function App() {
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    netlifyIdentity.on("login", () => setUserLoggedIn(true));
    netlifyIdentity.on("logout", () => setUserLoggedIn(false));

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <button onClick={() => netlifyIdentity.open()}>
                    {userLoggedIn ? "Logout" : "Login"}
                </button>
                <LambdaDemo />
            </header>
        </div>
    );
}

export default App;
