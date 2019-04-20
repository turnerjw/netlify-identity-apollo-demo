const { ApolloServer, gql } = require("apollo-server-lambda");

const typeDefs = gql`
    type Query {
        hello: String
        allAuthors: [Author!]
        author(id: Int!): Author
        authorByName(name: String!): Author
    }
    type Author {
        id: ID!
        name: String!
        married: Boolean!
    }
`;

const authors = [
    { id: 1, name: "Terry Pratchett", married: false },
    { id: 2, name: "Stephen King", married: true },
    { id: 3, name: "JK Rowling", married: false }
];

const resolvers = {
    Query: {
        hello: (root, args, { clientContext }) => {
            console.log(clientContext);

            if (clientContext && clientContext.user) {
                return `Hello, ${clientContext.user.user_metadata.full_name}!`;
            }
            return "Hello, world!";
        },
        allAuthors: (root, args, context) => {
            return authors;
        },
        author: (root, args, context) => {
            return;
        },
        authorByName: (root, args, context) => {
            console.log("hihhihi", args.name);
            return authors.find(x => x.name === args.name) || "NOTFOUND";
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ context }) => ({
        context,
        clientContext: context.clientContext
    })
});

exports.handler = server.createHandler();
