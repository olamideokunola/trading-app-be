var { ApolloServer } = require ('apollo-server-express');
var { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
require('dotenv').config();

var express = require ('express');
var http = require('http');
//var app = require('../app')

// for authentication
var passport = require('passport')
var authRouter = require('../routes/auth').router;
var getUserFromToken = require('../routes/auth').getUserFromToken;
require('../routes/auth').strategy();
var paymentRouter = require('../routes/payments')

var typeDefs = require('../graph/typeDefs')
var resolvers = require('../graph/resolvers')

var cors = require('cors')

const awilix = require('awilix')
const { createContainer, Lifetime, asFunction } = require('awilix')

const container = awilix.createContainer()

// Load our modules!
container.loadModules([
  // Globs!
  // [
  //   // To have different resolverOptions for specific modules.
  // //   'models/**/*.js',
  // //   {
  // //     register: awilix.asValue,
  // //     lifetime: Lifetime.SINGLETON
  // //   }
  // ],
  '../services/**/*.js',
  // '../repositories/**/*.js'
], {
    // We want to register `UserService` as `userService` -
    // by default loaded modules are registered with the
    // name of the file (minus the extension)
    formatName: 'camelCase',
    // Apply resolver options to all modules.
    resolverOptions: {
      // We can give these auto-loaded modules
      // the deal of a lifetime! (see what I did there?)
      // By default it's `TRANSIENT`.
      lifetime: Lifetime.SINGLETON,
      // We can tell Awilix what to register everything as,
      // instead of guessing. If omitted, will inspect the
      // module to determinw what to register as.
      register: awilix.asClass
    }
  }
)

// CORS setup
var whitelist = [
  'http://localhost:3000',
  "https://studio.apollographql.com", 
  'http://localhost:3001', 
  `http://${process.env.PAYMENTS_UI_HOST}:3000`, 
  `http://${process.env.TRADING_APP_UI_HOST}:3000`,
  `http://localhost:4000`,
  `chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop`
]

var corsOptions = {
  origin: function (origin, callback) {
    console.log(`origin is: ${origin}`)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async ({ req }) => {
      // Note: This example uses the `req` argument to access headers,
      // but the arguments received by `context` vary by integration.
      // This means they vary for Express, Koa, Lambda, etc.
      //
      // To find out the correct arguments for a specific integration,
      // see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields

      // Get the user token from the headers.
      const token = req.headers.authorization || '';
      console.log(`bearer token is ${req.headers.authorization}`)

      // Try to retrieve a user with the token
      const user = await getUserFromToken(token);
      console.log(`${user.email}`)
      console.log(user)

      // optionally block the user
      // we could also check user roles/permissions here
      // if (!user) throw new AuthenticationError('you must be logged in');

      // Add the user to the context
      return { user, loggedIn: true };
    },  
  });

  await server.start();

  // dependency injection container middleware
  app.use((req, res, next) => {
    req.container = container
    next()
  })

  // authentication with passport
  app.use(passport.initialize());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(cors(corsOptions))
  app.use('/login', authRouter);
  app.use('/users', authRouter)

  app.use('/payments', paymentRouter);

  server.applyMiddleware({ app });
  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers)
.then()