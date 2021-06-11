const catsController = require('../controllers/catsController');

module.exports = (app) => {
    app.get('/', (req, res) => res.redirect('/cats'));
    app.use('/cats', catsController);
    //app.get('/delete/:id', deleteCat)
}
