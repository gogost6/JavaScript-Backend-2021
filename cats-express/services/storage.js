const Cat = require('../models/Cat');
const Breed = require('../models/Breed');

async function init() {
    return (req, res, next) => {
        req.storage = {
            create,
            getAll,
            createBreed,
            getAllBreeds,
            edit,
            getById,
            deleteCat
        };
        next();
    };
}

async function create(cat) {
    const record = new Cat(cat);
    return record.save();
}

async function getById(id) {
    const cat = await Cat.findById(id).populate('accessories').lean();
    if (cat) {
        return cat;
    } else {
        return undefined;
    }
}

async function deleteCat(id) {
    await Cat.findOneAndDelete({ _id: id }, (err) => {
        if(err) {
            console.log(err);
        }
    });
}

async function edit(id, cat) {
    const existing = await Cat.findById(id);
    if (!existing) {
        throw new ReferenceError('No such ID in database');
    }

    Object.assign(existing, cat);
    return existing.save();
}

async function createBreed(breed) {
    const record = new Breed(breed);
    return record.save();
}

async function getAllBreeds() {
    return Breed.find({}).lean();
}

async function getAll(query) {
    return await Cat.find({ name: new RegExp(query.search, 'i') }).lean();
}

module.exports = {
    init,
    create,
    getAll,
    createBreed,
    getAllBreeds,
    edit,
    deleteCat,
    getById
}