// [x] initialize express app
// [x] setup handlebars
// [x] setup static files
// [x] setup storage middleware
// [x] set route handlers(controller actions) 

const express = require('express');
const hbs = require('express-handlebars');

const { init: storage } = require('./models/storage')

const { about } = require('./controllers/about');
const { catalog } = require('./controllers/catalog');
const { create, post } = require('./controllers/create');
const { details } = require('./controllers/details');
const { edit, post: editPost } = require('./controllers/edit');
const { delete: deletePost } = require('./controllers/delete');

const app = express();
const port = 3000;

start();

async function start() {
    app.engine('.hbs', hbs({ // по дифолт ги търси с .handlebars
        extname: '.hbs'
    }));
    app.set('view engine', 'hbs'); // при render('home') не е нужно да слагаме .hbs
    app.use('/static', express.static('static')); // явява се middleware за статичните файлове
    app.use(express.urlencoded({ extended: false }));
    app.use(await storage());
    app.use('/js', express.static('js'));

    app.get('/', catalog);
    app.get('/create', create);
    app.post('/create', post);
    app.get('/about', about);
    app.get('/details/:id', details);
    app.get('/edit/:id', edit);
    app.post('/edit/:id', editPost);
    app.get('/delete/:id', deletePost);
    app.listen(port, () => console.log(`Server is running on port ${port}...`));
}
