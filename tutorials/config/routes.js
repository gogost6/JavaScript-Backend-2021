const tutorialsController = require('../controllers/tutorials');
const userController = require('../controllers/user');

module.exports = (app) => {
    app.get('/', (req, res) => res.redirect('/tutorials'));
    app.use('/tutorials', tutorialsController);
    app.use('/user', userController);
}