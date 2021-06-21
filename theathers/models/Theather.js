const { Schema, model } = require('mongoose');

const schema = new Schema({
    theather: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    usersLiked: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: String, required: true }
});

module.exports = model('Theather', schema);