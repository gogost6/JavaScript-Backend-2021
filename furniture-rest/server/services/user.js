const User = require('../models/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');


async function register(email, password) {
    const pattern = new RegExp(`^${email}$`, 'i');
    const existing = await User.findOne({ email: { $regex: pattern } }).lean();
    
    if (existing) {
        const err = new Error('Email is taken');
        err.status = 409;
        throw err;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        email,
        hashedPassword
    });

    await user.save();
    
    return {
        _id: user._id,
        email: user.email,
        accessToken: createToken(user)
    };
}

async function login(email, password) {
    const user = await User.findOne({email}).lean();
    
    if (!user) {
        const err = new Error('Wrong email or password!');
        err.status = 401;
        throw err;
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!isMatch) {
        const err = new Error('Wrong email or password!');
        err.status = 401;
        throw err;
    }

    return {
        _id: user._id,
        email: user.email,
        accessToken: createToken(user)
    };
}

function createToken(user) {
    const token = jwt.sign({
        _id: user._id,
        email: user.email
    }, SECRET);

    return token;
}

module.exports = {
    register,
    login
};