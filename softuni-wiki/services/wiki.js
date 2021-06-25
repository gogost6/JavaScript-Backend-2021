const Article = require('../models/Article');
const User = require('../models/User');

async function getAll() {
    const article = Article.find({}).limit(3).lean();
    return article;
}

async function getAllSearch(query) {
    console.log(query);
    const article = Article.find({ title: new RegExp(query.title, 'i') }).lean();
    return article;
}

async function create(article) {
    const record = new Article(article);
    return record.save();
}

async function getById(id) {
    const article = Article.findOne({ _id: id }).lean();
    return article;
}

async function edit(id, data) {
    let record = await Article.findByIdAndUpdate({ _id: id }, data);
    return record.save();
}

async function deleteArticle(id) {
    await Article.findByIdAndRemove({ _id: id }, (err) => {
        if (err) {
            console.log(err);
        }
        console.log("Successful deletion");
    });
}

module.exports = {
    create,
    getAll,
    getById,
    edit,
    deleteArticle,
    getAllSearch
}