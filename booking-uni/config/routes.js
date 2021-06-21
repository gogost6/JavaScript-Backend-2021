const hotelsController = require('../controllers/hotelsController');
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController')
module.exports = (app) => {
    app.get('/', (req, res) => res.redirect('/hotels'));
    app.use('/hotels', hotelsController);
    app.use('/auth', authController);
    app.use('/profile', profileController);
}