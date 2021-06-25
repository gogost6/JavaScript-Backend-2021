module.exports = (app) => {
    app.engine('hbs', hbs({   //By default vs code uses .handlebars
        extname: '.hbs'
    }));
    app.set('view engine', 'hbs');
    app.use('/static', express.static('static')); // for the static files, starting with static
    app.use('/js', express.static('js'));
    app.use(express.urlencoded({ extended: false }));
}