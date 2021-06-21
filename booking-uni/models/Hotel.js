const { Schema, model } = require('mongoose');

const schema = new Schema({
    hotel: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    imgUrl: { type: String, required: true },
    freeRooms: { type: Number, required: true, minLength: 1, maxLength: 100 },
    bookedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: String, required: true }
});

module.exports = model('Hotel', schema);