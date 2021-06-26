const Shoe = require('../models/Shoe');
const User = require('../models/User');

async function getAll() {
    const shoes = Shoe.find({}).sort({ buyers: -1 }).lean();
    return shoes;
}

async function create(shoe, email) {
    const record = new Shoe(shoe);
    const user = await User.findOne({ email });
    await record.save();
    user.shoesForSale.push(record);
    user.totalToSpend += record.price;
    await user.save();
}

async function getById(id) {
    const shoe = Shoe.findOne({ _id: id }).lean();
    return shoe;
}

async function edit(id, data) {
    let record = await Shoe.findByIdAndUpdate({ _id: id }, data);
    return record.save();
}

async function deleteShoe(id) {
    await Shoe.findByIdAndRemove({ _id: id }, (err) => {
        if (err) {
            throw new Error(err);
        }
        console.log("Successful deletion");
    });
}

async function buy(id, email) {
    const shoe = await Shoe.findOne({ _id: id });
    const user = await User.findOne({ email });

    if (!shoe || !user) {
        throw new ReferenceError('Wrong data!');
    }

    const notOwner = shoe.owner != user.email ? true : false;

    if (notOwner) {
        shoe.buyers.push(user.email);
        await shoe.save();
        user.offersBought.push(shoe._id);
        user.totalToSpend += shoe.price;
        await user.save();
    } else {
        throw new Error('Owner can\'t buy his own shoes!');
    }
}

module.exports = {
    create,
    getAll,
    getById,
    edit,
    deleteShoe,
    buy
}