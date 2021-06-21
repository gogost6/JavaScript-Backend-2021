const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isAuth, isOwner } = require('../middlewares/guards');
const { preloadTheather } = require('../middlewares/preload');

router.get('/', async (req, res) => {
    if (res.locals.user) {
        const ctx = {
            title: 'User page',
            theathers: await req.storage.getAll()
        }

        res.render('user-home', ctx);
    } else {
        const ctx = {
            title: 'Guest page',
            theathers: await req.storage.getAllForGuests()
        }

        res.render('guest-home', ctx);
    }
});

router.get('/create', isAuth(), (req, res) => {
    res.render('create-theather', { title: 'Create page' });
})

router.post('/create', isAuth(),
    body('theather')
        .trim()
        .notEmpty()
        .withMessage('Theather should not be empty!'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description should not be empty!'),
    body('imageUrl')
        .trim()
        .notEmpty()
        .withMessage('Image URL should not be empty!!'),
    body('checkbox')
        .custom((value) => {
            if (value == "on") {
                return true;
            } else {
                return false;
            }
        }),
    async (req, res) => {

        try {
            const errors = Object.values(validationResult(req).mapped());
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }

            const ctx = {
                theather: req.body.theather,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                isPublic: req.body.checkbox == 'on' ? true : false,
                owner: res.locals.user.username
            }
            await req.storage.create(ctx);
            res.redirect('/theathers');
        } catch (err) {
            console.log(err);
            const data = {
                errors: err.message.split('\n'),
                title: 'Create page',
                data: {
                    theather: req.body.theather,
                    description: req.body.description,
                    imageUrl: req.body.imageUrl,
                    errors: err.message.split('\n'),
                    title: 'Create page'
                }
            }
            res.render('create-theather', data);
        }
    });

router.get('/details/:id', isAuth(), async (req, res) => {
    const data = await req.storage.getById(req.params.id);
    const user = await req.user.getUserByUsername(res.locals.user.username);

    const ctx = {
        title: 'Details page',
        data,
        owner: res.locals.user.username == data.owner,
        liked: user.likedPlays.find(x => x == req.params.id) ? true : false
    }
    console.log(ctx.liked);
    res.render('theather-details', ctx);
});

router.get('/edit/:id', preloadTheather(), isOwner(), async (req, res) => {
    const theatherData = await req.storage.getById(req.params.id);

    const ctx = {
        title: 'Edit page',
        data: theatherData
    }
    res.render('edit-theather', ctx);
});

router.post('/edit/:id', preloadTheather(), isOwner(),
    body('theather')
        .trim()
        .notEmpty()
        .withMessage('Theather should not be empty!'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description should not be empty!'),
    body('imageUrl')
        .trim()
        .notEmpty()
        .withMessage('Image URL should not be empty!!'),
    body('checkbox')
        .custom((value) => {
            if (value == "on") {
                return true;
            } else {
                return false;
            }
        }),
    async (req, res) => {

        const ctx = {
            theather: req.body.theather,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            isPublic: req.body.checkbox == 'on' ? true : false
        }

        try {
            const errors = Object.values(validationResult(req).mapped());
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }
            await req.storage.edit(req.params.id, ctx);
            res.redirect(`/theathers/details/${req.params.id}`);
        } catch (err) {
            console.log(err);
            const theatherData = await req.storage.getById(req.params.id);

            const ctx = {
                title: 'Edit page',
                theatherData,
                errors: err.message.split('\n')
            }

            res.render('edit', ctx);
        }
    });

router.get('/delete/:id', preloadTheather(), isOwner(), async (req, res) => {
    try {
        const errors = Object.values(validationResult(req).mapped());
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.msg).join('\n'));
        }

        await req.storage.deleteTheather(req.params.id);
        res.redirect('/', 304, { title: 'Home page' });
    } catch (err) {
        console.log(err);
        res.redirect(`/theathers/details/${req.params.id}`, { errors: err.message.split('\n') })
    }
});

router.get('/like/:id', isAuth(), async (req, res) => {
    try {
        const errors = Object.values(validationResult(req).mapped());
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.msg).join('\n'));
        }

        await req.storage.like(req.params.id, res.locals.user.username);
        res.redirect(`/theathers/details/${req.params.id}`, 304, { title: 'Details page' });
    } catch (err) {
        console.log(err);
        res.redirect(`/theathers/details/${req.params.id}`, { errors: err.message.split('\n') });
    }
});

router.get('/sortByLikes', isAuth(), async (req, res) => {
    try {
        const errors = Object.values(validationResult(req).mapped());
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.msg).join('\n'));
        }

        const ctx = {
            title: 'User page',
            theathers: await req.storage.getAll(true)
        }

        res.render('user-home', ctx);
    } catch (err) {
        console.log(err);
        const ctx = {
            title: 'User page',
            theathers: await req.storage.getAll(true)
        }

        res.render('user-home', ctx);
    }
});

module.exports = router;