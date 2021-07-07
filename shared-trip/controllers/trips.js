const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isOwner, isGuest, isAuth } = require('../middlewares/guards');
const { preloadTrip } = require('../middlewares/preload');

router.get('/', async (req, res) => {

    const ctx = {
        title: 'Home page',
        trips: await req.storage.getAll()
    }
    res.render('home', ctx);
});

router.get('/shared', async (req, res) => {
    const ctx = {
        data: await req.storage.getAll(),
        title: 'Shared trips'
    }

    res.render('shared-trips', ctx)
})

router.get('/create', isAuth(), async (req, res) => {
    res.render('trip-create', { title: 'Create page' })
});

router.post('/create', isAuth(),
    body('startingPoint')
        .trim()
        .isLength({ min: 4 })
        .withMessage('Starting point should be at least 4 characters long!'),
    body('endPoint')
        .trim()
        .isLength({ min: 4 })
        .withMessage('End point should be at least 4 characters long!'),
    body('seats')
        .trim()
        .isInt()
        .withMessage('Seats should be possitive integer!')
        .isLength({ min: 0, max: 4 })
        .withMessage('Seats should be from 0 to 4!'),
    body('description')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Description should be at least 10 characters long!'),
    body('carImage')
        .trim()
        .isURL()
        .withMessage('Car image should not valid URL!'),
    body('carBrand')
        .trim()
        .isLength({ min: 4 })
        .withMessage('Car brand should be at least 4 characters long!'),
    body('price')
        .trim()
        .isInt()
        .withMessage('Price should be possitive integer!')
        .isLength({ min: 1, max: 50 })
        .withMessage('Price should be from 1 to 50!'),
    async (req, res) => {
        try {
            const errors = Object.values(validationResult(req).mapped());
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }

            const ctx = {
                startingPoint: req.body.startingPoint,
                endPoint: req.body.endPoint,
                seats: req.body.seats,
                description: req.body.description,
                date: req.body.date,
                time: req.body.time,
                carImage: req.body.carImage,
                carBrand: req.body.carBrand,
                price: req.body.price,
                title: "Create page",
                owner: res.locals.user
            }

            await req.storage.create(ctx, res.locals.user.email);
            res.render('shared-trips', {
                data: await req.storage.getAll(),
                title: 'Shared trips'
            });
        } catch (err) {
            console.log(err);
            const data = {
                errors: err.message.split('\n'),
                title: 'Create page',
                data: {
                    startingPoint: req.body.startingPoint,
                    endPoint: req.body.endPoint,
                    seats: req.body.seats,
                    description: req.body.description,
                    carImage: req.body.carImage,
                    carBrand: req.body.carBrand,
                    price: req.body.price,
                    title: "Create page",
                    errors: err.message.split('\n')
                }
            }
            res.render('trip-create', data);
        }
});

router.get('/details/:id', async (req, res) => {
    const trip = await req.storage.getById(req.params.id);
    const emailForUser = res.locals.user ? res.locals.user.email : undefined;
    const user = await req.user.getUserByEmail(emailForUser);
    const passengers = trip.buddies.length > 0 ? true : false;

    if (passengers) {
        let emails = [];
        trip.buddies.forEach(e => {
            emails.push(e.email);
        });

        const ctx = {
            trip,
            id: req.params.id,
            seats: trip.seats > 0 ? true : false,
            buddie: trip.buddies.find(x => x.email == user.email) ? true : false,
            passengers,
            title: "Details page",
            emails: emails.join(', ')
        }

        if(user) {
            ctx.owner = user.createdTrips.find(x => x._id == req.params.id) ? true : false;
        }
        console.log(ctx.owner);
        res.render('trip-details', ctx)
    } else {
        const ctx = {
            trip,
            id: req.params.id,
            seats: trip.seats > 0 ? true : false,
            buddie: trip.buddies.find(x => x.email == user.email) ? true : false,
            passengers,
            title: "Details page",
        }

        if(user) {
            ctx.owner = user.createdTrips.find(x => x._id == req.params.id) ? true : false;
        }

        res.render('trip-details', ctx)
    }
});

router.get('/join/:id', isAuth(), async (req, res) => {
    const errors = Object.values(validationResult(req).mapped());
    if (errors.length > 0) {
        throw new Error(errors.map(e => e.msg).join('\n'));
    }

    await req.storage.joinTrip(req.params.id, res.locals.user.email);
    res.redirect(`/trips/details/${req.params.id}`, 304, { title: 'Details page' });
});

router.get('/edit/:id', preloadTrip(), isOwner(), async (req, res) => {
    const ctx = {
        title: 'Edit page',
        data: await req.storage.getById(req.params.id),
        id: req.params.id
    }

    res.render('trip-edit', ctx);
})

router.post('/edit/:id', preloadTrip(), isOwner(),
    body('startingPoint')
        .trim()
        .isLength({ min: 4 })
        .withMessage('Starting point should be at least 4 characters long!'),
    body('endPoint')
        .trim()
        .isLength({ min: 4 })
        .withMessage('End point should be at least 4 characters long!'),
    body('seats')
        .trim()
        .isInt()
        .withMessage('Seats should be possitive integer!')
        .isLength({ min: 0, max: 4 })
        .withMessage('Seats should be from 0 to 4!'),
    body('description')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Description should be at least 10 characters long!'),
    body('carImage')
        .trim()
        .isURL()
        .withMessage('Car image should not valid URL!'),
    body('carBrand')
        .trim()
        .isLength({ min: 4 })
        .withMessage('Car brand should be at least 4 characters long!'),
    body('price')
        .trim()
        .isInt()
        .withMessage('Price should be possitive integer!')
        .isLength({ min: 1, max: 50 })
        .withMessage('Price should be from 1 to 50!'),
    async (req, res) => {
        try {
            const errors = Object.values(validationResult(req).mapped());
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }

            const ctx = {
                startingPoint: req.body.startingPoint,
                endPoint: req.body.endPoint,
                seats: req.body.seats,
                description: req.body.description,
                date: req.body.date,
                time: req.body.time,
                carImage: req.body.carImage,
                carBrand: req.body.carBrand,
                price: req.body.price,
                title: "Details page"
            }
            console.log(req.body);
            await req.storage.edit(req.params.id, ctx);
            res.redirect(`/trips/details/${req.params.id}`);
        } catch (err) {
            console.log(err);
            const ctx = {
                errors: err.message.split('\n'),
                title: 'Edit page',
                id: req.params.id,
                data: {
                    startingPoint: req.body.startingPoint,
                    endPoint: req.body.endPoint,
                    seats: req.body.seats,
                    description: req.body.description,
                    date: req.body.date,
                    time: req.body.time,
                    carImage: req.body.carImage,
                    carBrand: req.body.carBrand,
                    price: req.body.price
                }
            }
            res.render(`trip-edit`, ctx);
        }
    });

router.get('/delete/:id', preloadTrip(), isOwner(), async (req, res) => {
    try {
        await req.storage.deleteTrip(req.params.id);
        res.render('shared-trips', {
            data: await req.storage.getAll(),
            title: 'Shared trips'
        });
    } catch (err) {
        console.log(err);
        res.redirect(`/trips/details/${req.params.id}`);
    }
});

router.get('/profile', isAuth(), async (req, res) => {
    const user = await req.user.getUserByEmail(res.locals.user.email);

    const ctx = {
        user,
        title: 'Profile page'
    }
    res.render('profile', ctx);
});

module.exports = router;