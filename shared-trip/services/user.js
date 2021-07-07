const User = require('../models/User');

async function createUser(email, hashedPassword, gender) {
    const user = new User({
        email,
        hashedPassword,
        gender
    });

    await user.save();

    return user;
}

async function getUserByEmail(email) {
    const pattern = new RegExp(`^${email}$`, 'i');
    if(email) {
        return await User.findOne({ email: { $regex: pattern } }).populate('createdTrips').lean();
    } else {
        return false;
    }
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