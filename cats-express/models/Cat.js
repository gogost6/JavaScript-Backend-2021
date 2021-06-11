const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true, maxLength: 300 },
    imageUrl: { type: String, required: true, match: /^https?:\/\// },
    breed: {type: String, required: true}
})

module.exports = model('Cat', schema);