const { model, Schema } = require('mongoose');

const schema = {
    startingPoint: { type: String, required: true },
    endPoint: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    carImage: { type: String, required: true },
    carBrand: { type: String, required: true },
    seats: { type: Number, required: true, default: 0},
    price: { type: Number, required: true, default: 1 },
    description: { type: String, required: true},
    owner:  { type: Schema.Types.ObjectId, ref: 'User' },
    buddies: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}

module.exports = model('Trip', schema);
