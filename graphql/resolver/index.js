const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const returnEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
    }
};

const returnBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString(),
    }
}

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return returnEvent(event);
        });
    } catch (err) {
        throw err;
    };
};

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    } catch (err) {

        throw err;
    };
};

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return returnEvent(event);
    } catch (error) {

    }
};

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return returnEvent(event);
            });
        } catch (err) { throw err; };
    },
    users: async () => {
        try {
            const users = await User.find();
            return users.map(user => {
                return {
                    ...user._doc,
                    _id: user.id,
                    createdEvents: events.bind(this, user._doc.createdEvents)
                }
            });
        } catch (err) {
            throw err;
        }
    },
    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return returnBooking(booking);
            });
        } catch (error) {
            throw error;
        }
    },

    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const event = new Event({
                title: args.input.title,
                price: +args.input.price,
                date: new Date(args.input.date),
                creator: req.userId
            });
            let createdEvent;
            const result = await event.save();
            createdEvent = returnEvent(result);
            const creator = await User.findById(req.userId);

            if (!creator) {
                throw new Error('user not found');
            }
            creator.createdEvents.push(event);
            await creator.save();

            return createdEvent;
        } catch (err) {
            throw err;
        };
    },
    createUser: async args => {
        try {
            const findUser = await User.findOne({ email: args.input.email });

            if (findUser) {
                throw new Error('user exist already');
            }
            const hashedPass = await bcrypt.hash(args.input.password, 12);

            const user = new User({
                email: args.input.email,
                password: hashedPass,
            });
            const result = await user.save();

            return {
                ...result._doc,
                password: null,
                _id: result.id
            }
        } catch (err) {
            throw err;
        };
    },
    bookingEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const fetchEvent = await Event.findOne({ _id: args.eventId });
            const booking = new Booking({
                user: req.userId,
                event: fetchEvent
            });
            const result = await booking.save();
            return returnBooking(result);
        } catch (error) {
            throw error;
        }
    },
    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('Event');
            const event = returnEvent(booking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (error) {
            throw error;
        }
    },
    login: async ({ email, password }) => {

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('user does not exist');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('password salah coeg');
        }
        const token = await jwt.sign({ userId: user.id, email: user.email }, 'itscoegcrypkey', {
            expiresIn: '1h'
        });
        return { userId: user.id, token: token, tokenExpiration: 1 };

    }
}; 