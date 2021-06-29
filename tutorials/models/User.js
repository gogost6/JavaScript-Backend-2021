const { Schema, model } = require('mongoose');

const schema = {
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Tut' }]
};

module.exports = model('User', schema);