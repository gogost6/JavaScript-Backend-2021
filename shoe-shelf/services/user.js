const User = require('../models/User');

async function createUser(email, fullName, hashedPassword) {
    const user = new User({
        email,
        fullName,
        hashedPassword
    });

    await user.save();

    return user;
}

async function getUserByEmail(email) {
    const pattern = new RegExp(`^${email}$`, 'i');
    return await User.findOne({ email: { $regex: pattern } }).populate('offersBought').lean();
}

async function getAllUsers() {
    let users = User.find({}).lean();
    return users;
}

module.exports = {
    createUser,
    getUserByEmail,
    getAllUsers
};