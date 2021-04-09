const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const { PubSub } = require('apollo-server');
const fs = require('fs');
const path = require('path');

const { getUserId } = require('./utils');

const Vote = require('./resolvers/Vote');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');

const resolvers = {
  Vote,
  User,
  Link,
  Query,
  Mutation,
  Subscription,
};

const pubsub = new PubSub();
const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
  context: ({ req }) => ({
    ...req,
    prisma,
    pubsub,
    userId: req && req.headers.authorization ? getUserId(req) : null,
  }),
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
