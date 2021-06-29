const User = require('../models/User');

async function createUser(username, hashedPassword) {
    const user = new User({
        username,
        hashedPassword
    });

    await user.save();

    return user;
}

async function getUserByUsername(username) {
    const pattern = new RegExp(`^${username}$`, 'i');
    return await User.findOne({ username: { $regex: pattern } }).lean();
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