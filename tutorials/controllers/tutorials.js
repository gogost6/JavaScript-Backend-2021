const router = require('express').Router();
const { check, body, validationResult } = require('express-validator');
const { isOwner, isGuest, isAuth } = require('../middlewares/guards');
const { preloadTut } = require('../middlewares/preload');

router.get('/', async (req, res) => {
    if (res.locals.user) {
        const ctx = {
            title: 'Tutorials',
            tuts: await req.storage.getAll()
        }
        res.render('home pages/user-home', ctx);
    } else {
        const ctx = {
            title: 'Tutorials',
            tuts: await req.storage.getAllGuest()
        }
        res.render('home pages/guest-home', ctx);
    }
});

router.get('/create', isAuth(), async (req, res) => {
    res.render('course pages/create-course', { title: 'Create page' })
});

router.post('/create',
    isAuth(),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title should not be empty!'),
    body('duration')
        .trim()
        .notEmpty()
        .withMessage('Duration should not be empty!'),
    body('imageUrl')
        .trim()
        .notEmpty()
        .withMessage('Image URL should not be empty!'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description should not be empty!'),
    async (req, res) => {
        try {
            const errors = Object.values(validationResult(req).mapped());
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }

            let username = res.locals.user.username;
            const ctx = {
                title: req.body.title,
                duration: req.body.duration,
                imageUrl: req.body.imageUrl,
                description: req.body.description,
                owner: res.locals.user.username
            }

            await req.storage.create(ctx);
            res.redirect('/');
        } catch (err) {
            console.log(err);
            const data = {
                errors: err.message.split('\n'),
                title: 'Create page',
                data: {
                    title: req.body.title,
                    duration: req.body.duration,
                    imageUrl: req.body.imageUrl,
                    description: req.body.description,
                    errors: err.message.split('\n')
                }
            }
            res.render('course pages/create-course', data);
        }
    });

router.get('/details/:id', isAuth(), async (req, res) => {
    const tut = await req.storage.getById(req.params.id);
    const user = await req.user.getUserByUsername(res.locals.user.username);

    const ctx = {
        tut,
        owner: tut.owner == user.username ? true : false,
        enrolled: user.enrolledCourses.find(x => x == req.params.id) ? true : false
    }

    res.render('course pages/course-details', ctx)
});

router.get('/edit/:id', preloadTut(), isOwner(), async (req, res) => {
    const ctx = {
        title: 'Edit page',
        data: await req.storage.getById(req.params.id)
    }

    res.render('course pages/edit-course', ctx);
})

router.post('/edit/:id', preloadTut(), isOwner(),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title should not be empty!'),
    body('duration')
        .trim()
        .notEmpty()
        .withMessage('Duration should not be empty!'),
    body('imageUrl')
        .trim()
        .notEmpty()
        .withMessage('Image URL should not be empty!'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description should not be empty!'),
    async (req, res) => {
        try {
            const errors = Object.values(validationResult(req).mapped());
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }

            const ctx = {
                title: req.body.title,
                duration: req.body.duration,
                imageUrl: req.body.imageUrl,
                description: req.body.description
            }

            await req.storage.edit(req.params.id, ctx);
            res.redirect(`/tutorials/details/${req.params.id}`);
        } catch (err) {
            console.log(err);
            const data = {
                errors: err.message.split('\n'),
                title: 'Edit page',
                data: {
                    title: req.body.title,
                    duration: req.body.duration,
                    imageUrl: req.body.imageUrl,
                    description: req.body.description,
                    errors: err.message.split('\n')
                }
            }
            res.render('course pages/edit-course', data);
        }
    });

router.get('/delete/:id', preloadTut(), isOwner(), async (req, res) => {
    try {
        await req.storage.deleteTut(req.params.id);
        res.redirect('/tutorials');
    } catch (err) {
        console.log(err);
        res.redirect(`/tutorials/details/${req.params.id}`);
    }
});

router.get('/enroll/:id', isAuth(), async (req, res) => {
    const tut = await req.storage.getById(req.params.id);
    const user = await req.user.getUserByUsername(res.locals.user.username);

    const ctx = {
        tut,
        owner: tut.owner == res.locals.user.username ? true : false,
        enrolled: user.enrolledCourses.find(x => x == req.params.id) ? true : false
    }


    try {
        await req.storage.enroll(req.params.id, res.locals.user.username);
        res.redirect(`/tutorials/details/${req.params.id}`, 200, ctx);
    } catch (err) {
        console.log(err);
        res.redirect(`/tutorials/details/${req.params.id}`, 200, ctx);
    }
});

router.get('/search', isAuth(), async (req, res) => {

    const ctx = {
        title: 'Tutorials',
        tuts: await req.storage.getAll(req.query)
    }
    res.render('home pages/user-home', ctx);
})

module.exports = router;