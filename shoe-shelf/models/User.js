const { Schema, model } = require('mongoose');

const schema = {
    email: { type: String, required: true },
    fullName: { type: String },
    hashedPassword: { type: String, required: true },
    offersBought: [{ type: Schema.Types.ObjectId, ref: 'Shoe' }],
    shoesForSale: [{ type: Schema.Types.ObjectId, ref: 'Shoe' }],
    totalToSpend: { type: Number, default: 0 }
};

module.exports = model('User', schema);