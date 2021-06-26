const shoesController = require('../controllers/shoes');
const userController = require('../controllers/user');

module.exports = (app) => {
    app.get('/', (req, res) => res.redirect('/shoes'));
    app.use('/shoes', shoesController);
    app.use('/user', userController);
}