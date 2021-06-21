const Theather = require('../models/Theather');
const User = require('../models/User');

async function getAll(likes) {
    if (likes == true) {
        const theather = Theather.find({}).sort({usersLiked: -1}).lean();
        return theather;
    } else {
        const theather = Theather.find({}).sort({createdAt: 'desc'}).lean();
        return theather;
    }
}

async function getAllForGuests() {
    const theather = Theather.find({}).sort({usersLiked: -1}).limit(3).lean();
    return theather;
}

async function create(theather) {
    const record = new Theather(theather);
    return record.save();
}

async function getById(id) {
    const theather = Theather.findOne({ _id: id }).lean();
    return theather;
}

async function edit(id, data) {
    let record = await Theather.findByIdAndUpdate({ _id: id }, data);
    return record.save();
}

async function deleteTheather(id) {
    await Theather.findByIdAndRemove({ _id: id }, (err) => {
        if(err) {
            console.log(err);
        }
        console.log("Successful deletion");
    });
}

async function like(id, username) {
    const theather = await Theather.findOne({ _id: id });
    const user = await User.findOne({username});

    if(!theather || !user) {
        throw new ReferenceError('Wrong data!');
    }

    theather.usersLiked.push(user);
    theather.save();
    user.likedPlays.push(theather);
    return user.save();
}

async function offered(name, username) {
    const theather = await Theather.findOne({ theather: name });
    const user = await User.findOne({username});

    if(!theather || !user) {
        throw new ReferenceError('Wrong data!');
    }
    user.offeredTheathers.push(theather);
    return user.save();
}

module.exports = {
            create,
            getAll,
            getById,
            edit,
            deleteTheather,
            like,
            offered,
            getAllForGuests
        }