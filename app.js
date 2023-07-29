const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const isAuth = require('./middleware/is_auth')

const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type , Authorization');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);

app.use('/graphql',
graphqlHTTP({   // ! doesn't all the event to return NULL values
                //query: We wanna Fetch data  //Mutation: We wanna change data
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true,
})
);

mongoose
.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}
@cluster0.4xcj0.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).
then(()=>   {       //If we succesfully get connected to the server
app.listen(3000)
}).
catch(err => {      //If we get some error
    console.log(err);
});
