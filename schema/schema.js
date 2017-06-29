const graphql = require('graphql');
// const _=require('lodash');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema // take in an rootquery and return a graphql schema instance
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString }
  }
})

const UserType = new GraphQLObjectType({
  name: 'User', // Capital first letter
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,

      // teach GraphQL to associate from User to company
      resolve(parentValue, args) {
        // console.log(parentValue, args);
// { id: '42', firstName: 'Damien', age: 21, companyId: '2' } {}

        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
        .then(response => response.data);
      }
    }
  }
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) { // go to database, look and drag the data
        // return _.find(users, { id: args.id }); users here is
        // fake

        // return the promise
        return axios.get(`http://localhost:3000/users/${args.id}`)
        .then(response => response.data)
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
