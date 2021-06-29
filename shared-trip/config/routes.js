const tripsController = require('../controllers/trips');
const userController = require('../controllers/user');

module.exports = (app) => {
    app.get('/', (req, res) => res.redirect('/trips'));
    app.use('/trips', tripsController);
    app.use('/user', userController);
    app.all('*', (req, res) => {
        res.render('404', {title: 'Page Not Found'});
    });
}