const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Event {
    _id: ID!
    title: String!
    price: Float!
    date: String!
    creator: User!
}

type User {
    _id : ID!
    email: String!
    password: String
    createdEvents: [Event!]
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
}

type Booking {
    _id: ID!
    event:Event!
    user:User!
    createdAt:String!
    updatedAt: String!
}

input EventInput{
    title: String!
    price: Float!
    date: String!
}

input UserInput{
    email: String!
    password: String!
}

type RootQuery {
    events : [Event!]!
    users : [User]
    bookings: [Booking!]!
    login(email:String!, password:String!): AuthData!
}

type RootMutation {
    createEvent(input:EventInput): Event
    createUser(input:UserInput): User
    bookingEvent(eventId: ID!): Booking!
    cancelBooking(bookingId:ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);