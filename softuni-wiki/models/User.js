const { Schema, model } = require('mongoose');

const schema = new Schema({
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    createdArticles: [{ type: Schema.Types.ObjectId, ref: 'Article' }]
});

module.exports = model('User', schema);