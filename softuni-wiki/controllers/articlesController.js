const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isAuth, isOwner } = require('../middlewares/guards');
const { preloadArticle } = require('../middlewares/preload');

router.get('/', async (req, res) => {
    const ctx = {
        title: 'Home page',
        article: await req.storage.getAll()
    }

    res.render('index', ctx);
});

router.get('/search', async (req, res) => {
    const ctx = {
        found: await req.storage.getAllSearch(req.query)
    };

    res.render('search-results', ctx)
});

router.get('/articles', async (req, res) => {
    const ctx = {
        title: 'All articles page',
        articles: await req.storage.getAll()
    }

    res.render('all-articles', ctx);
});

router.get('/add', isAuth(), (req, res) => {
    res.render('create', { title: 'Create page' });
});

router.post('/add', isAuth(),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Article should have a title!'),
    body('description')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Article should be between 5 and 200 characters long!'),
    async (req, res) => {

        try {
            const errors = Object.values(validationResult(req).mapped());
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }

            const ctx = {
                title: req.body.title,
                description: req.body.description,
                owner: res.locals.user.username
            }
            
            await req.storage.create(ctx);
            res.redirect('/wiki');
        } catch (err) {
            console.log(err);
            const data = {
                errors: err.message.split('\n'),
                title: 'Create page',
                data: {
                    title: req.body.title,
                    description: req.body.description,
                    errors: err.message.split('\n')
                }
            }
            res.render('create', data);
        }
    });

router.get('/article/:id', isAuth(), async (req, res) => {
    const data = await req.storage.getById(req.params.id);
    //const user = await req.user.getUserByUsername(res.locals.user.username);

    const ctx = {
        title: 'Details page',
        data,
        owner: res.locals.user.username == data.owner
    }

    res.render('article', ctx);
});

router.get('/edit/:id', preloadArticle(), isOwner(), async (req, res) => {
    const article = await req.storage.getById(req.params.id);

    const ctx = {
        title: 'Edit page',
        article
    }
    res.render('edit', ctx);
});

router.post('/edit/:id', preloadArticle(), isOwner(),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Article should have a title!'),
    body('description')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Article should be between 5 and 200 characters long!'),
    async (req, res) => {

        const data = {
            title: req.body.title,
            description: req.body.description,
        }


        try {
            const errors = Object.values(validationResult(req).mapped());
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }
            await req.storage.edit(req.params.id, data);
            res.redirect(`/wiki/article/${req.params.id}`);
        } catch (err) {
            console.log(err);
            const data = await req.storage.getById(req.params.id);

            const ctx = {
                title: 'Edit page',
                data,
                errors: err.message.split('\n')
            }

            res.render('edit', ctx);
        }
    });

router.get('/delete/:id', preloadArticle(), isOwner(), async (req, res) => {
    try {
        const errors = Object.values(validationResult(req).mapped());
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.msg).join('\n'));
        }

        await req.storage.deleteArticle(req.params.id);
        res.redirect('/', 304, { title: 'Home page' });
    } catch (err) {
        console.log(err);
        res.redirect(`/wiki/article/${req.params.id}`, { errors: err.message.split('\n') })
    }
});

module.exports = router;