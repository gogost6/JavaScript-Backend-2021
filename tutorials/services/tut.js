const Tut = require('../models/Tut');
const User = require('../models/User');

async function getAll(name) {
    let tuts;
    if (name) {
        const pattern = new RegExp(`^${name.title}`, 'i');
        tuts = Tut.find({ title: { $regex: pattern } }).lean();
        return tuts;
    }

    tuts = Tut.find({}).lean();
    return tuts;

}

async function getAllGuest() {
    const tuts = Tut.find({}).sort({ usersEnrolled: -1 }).limit(3).lean();
    return tuts;
}

async function create(tut) {
    const record = new Tut(tut);
    // const user = await User.findOne({ username });
    await record.save();
    // user.shoesForSale.push(record);
    // user.totalToSpend += record.price;
    // await user.save();
}

async function getById(id) {
    const tut = Tut.findOne({ _id: id }).lean();
    return tut;
}

async function edit(id, data) {
    let record = await Tut.findByIdAndUpdate({ _id: id }, data);
    return record.save();
}

async function deleteTut(id) {
    await Tut.findByIdAndRemove({ _id: id }, (err) => {
        if (err) {
            throw new Error(err);
        }
        console.log("Successful deletion");
    });
}

async function enroll(id, username) {
    const tut = await Tut.findOne({ _id: id });
    const user = await User.findOne({ username });

    if (!tut || !user) {
        throw new ReferenceError('Wrong data!');
    }

    const notOwner = tut.owner != user.username ? true : false;

    if (notOwner) {
        tut.usersEnrolled.push(user);
        await tut.save();
        user.enrolledCourses.push(tut)
        await user.save();
    } else {
        throw new Error('Owner can\'t enroll for his own course!');
    }
}

module.exports = {
    create,
    getAll,
    getAllGuest,
    getById,
    edit,
    deleteTut,
    enroll
}