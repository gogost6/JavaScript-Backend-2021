const Furniture = require('../models/Furniture');

async function getAll() {
    return Furniture.find({}).lean();
}

async function getAllUser(userId) {
    return Furniture.find({owner: userId}).lean();
}

async function getById(id) {
    return Furniture.findById(id).lean();
}

async function create(data) {
    const result = new Furniture(data);
    await result.save();
    return result;
}

async function edit(id, data) {
    const result = Furniture.findByIdAndUpdate(id, data, (err, docs) => {
        if(err) {
            console.log(err);
        } else {
            console.log('Updated furniture: ', docs)
        }
    });
    
    return result;
}

async function deleteFurniture(id) {
    const result = Furniture.findByIdAndRemove(id, (err, doc) => {
        if(err) {
            console.log(err);
        } else {
            console.log('Deleted furniture: ', doc)
        }
    });
    
    return;
}


module.exports = {
    getAll,
    getById,
    create,
    edit,
    deleteFurniture,
    getAllUser
};