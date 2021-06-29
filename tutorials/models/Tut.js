const { model, Schema } = require('mongoose');

const schema = {
    title: { type: String, required: true },
    description: { type: String, required: true, max: [50, 'Description should be max length of 50 symbols']},
    imageUrl: { type: String, required: true },
    duration: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    usersEnrolled: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: String }
}

module.exports = model('Tut', schema);
