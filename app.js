const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const gQlSchema = require('./graphql/schema/index');
const gQlResolver = require('./graphql/resolver/index');
const isAuth = require('./midleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);

app.use('/graphql',
    graphqlHttp({
        graphiql: true,
        schema: gQlSchema,
        rootValue: gQlResolver,
    }
    ));

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphqlcoeg-8xrgp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
).then(() => {
    app.listen(8000);
}).catch(err => {
    console.log(err);
});


