import React, { Component } from "react";
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

const LambdaDemo = () => (
    <ApolloProvider client={client}>
        <Query query={helloQuery}>
            {({ data, loading }) => (
                <div>
                    A greeting from the server:{" "}
                    {loading ? "loading" : data.hello}
                </div>
            )}
        </Query>
    </ApolloProvider>
);

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <button onClick={() => netlifyIdentity.open()}>
                        Login
                    </button>
                    <LambdaDemo />
                </header>
            </div>
        );
    }
}

export default App;
