const { model, Schema } = require('mongoose');

const schema = {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: [0, 'Price must be above 0!'] },
    imageUrl: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    buyers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: String }
}

module.exports = model('Shoe', schema);
