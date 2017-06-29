const graphql = require('graphql');
// const _=require('lodash');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,// take in an rootquery and return a graphql schema instance
  GraphQLList,
  GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType), // collection of users to this company
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
        .then( response => response.data);
      }
    }
  })
})

const UserType = new GraphQLObjectType({
  name: 'User', // Capital first letter
  fields: () => ({
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
  })
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {

    user: { // query to user type
      type: UserType, // type to return
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) { // go to database, look and drag the data
        // return _.find(users, { id: args.id }); users here is
        // fake

        // return the promise
        return axios.get(`http://localhost:3000/users/${args.id}`)
        .then(response => response.data)
      }
    },

    company: { // query to company
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
        .then(response => response.data);
      }
    }

  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {

    addUser: {
      type: UserType, // type to return
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age }) {
        return axios.post('http://localhost:3000/users', { firstName, age })
          .then(response => response.data);
      }
    },

    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios.delete(`http://localhost:3000/users/${id}`)
        .then(response => response.data);
      }
    },

    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, args) { // it will ignore the id, not update id
        return axios.patch(`http://localhost:3000/users/${args.id}`, args)
        .then(response => response.data);
      }
    }

  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
