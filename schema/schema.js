const graphql = require('graphql');
const _=require('lodash');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema // take in an rootquery and return a graphql schema instance
} = graphql;

const users = [
  { id: '20', firstName: 'Thai', age: 20 },
  { id: '42', firstName: 'Damien', age: 21 },
]

const UserType = new GraphQLObjectType({
  name: 'User', // Capital first letter
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) { // go to database, look and drag the data
        return _.find(users, { id: args.id });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
