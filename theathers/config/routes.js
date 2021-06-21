const theathersController = require('../controllers/theathersController');
const userController = require('../controllers/userController');

module.exports = (app) => {
    app.get('/', (req, res) => res.redirect('/theathers'));
    app.get('/theathers/sortByDate', (req, res) => res.redirect('/theathers'));
    app.use('/theathers', theathersController);
    app.use('/user', userController);
}