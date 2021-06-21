const User = require('../models/User');


async function createUser(email, username, hashedPassword) {
    const user = new User({
        email,
        username,
        hashedPassword
    });

    await user.save();

    return user;
}

async function getUserByUsername(username) {
    return await User.findOne({ username: { $regex: username, $options: 'i' } }).lean();
}

async function getAllUsers() {
    let users = User.find({}).lean();
    return users;
}

module.exports = {
    createUser,
    getUserByUsername,
    getAllUsers
};