const { Schema, model } = require('mongoose');

const schema = {
    email: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    gender: { type: String, required: true },
    tripsHistory: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
    createdTrips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }]
};

module.exports = model('User', schema);