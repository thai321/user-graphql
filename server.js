const express = require('express');
const expressGraphQL = require('express-graphql');

const schema = require('./schema/schema');

const app = express();

// wireup to middleware
app.use('/graphql', expressGraphQL({
  schema, // schema: schema ES6
  graphiql: true
}));

app.listen(4000, () => {
  console.log('Listening');
});
