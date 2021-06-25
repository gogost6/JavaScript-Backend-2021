const articlesController = require('../controllers/articlesController');
const authController = require('../controllers/authController');

module.exports = (app) => {
    app.get('/', (req, res) => res.redirect('/wiki'));
    app.use('/wiki', articlesController);
    app.use('/auth', authController);
}