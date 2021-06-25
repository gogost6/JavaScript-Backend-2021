const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isAuth, isOwner } = require('../middlewares/guards');
const { preloadHotel } = require('../middlewares/preload');

router.get('/', async (req, res) => {
    const ctx = {
        title: 'Home page',
        hotels: await req.storage.getAll()
    }

    res.render('home', ctx);
});

router.get('/add', isAuth(), (req, res) => {
    res.render('create', { title: 'Create page' });
})

router.post('/add', isAuth(),
    body('hotel')
        .trim()
        .isLength({ min: 4 })
        .withMessage('Hotel should be atleast 4 characters long!'),
    body('city')
        .trim()
        .isLength({ min: 3 })
        .withMessage('City should be atleast 3 characters long!'),
    body('imgUrl')
        .trim()
        .isURL()
        .withMessage('Please enter a valid URL!'),
    body('free-rooms')
        .trim()
        .trim()
        .custom((value) => {
            if (Number(value) > 100 || Number(value) < 1) {
                throw new Error('Free rooms should be between 1 and 100!');
            }
            return true;
        }),
    async (req, res) => {

        try {
            const errors = Object.values(validationResult(req).mapped());
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }

            const ctx = {
                hotel: req.body.hotel,
                city: req.body.city,
                imgUrl: req.body.imgUrl,
                freeRooms: req.body['free-rooms'],
                owner: res.locals.user.username
            }
            await req.storage.create(ctx);
            await req.storage.offered(req.body.hotel, res.locals.user.username);
            res.redirect('/hotels');
        } catch (err) {
            console.log(err);
            const data = {
                errors: err.message.split('\n'),
                title: 'Create page',
                data: {
                    hotel: req.body.hotel,
                    city: req.body.city,
                    imgUrl: req.body.imgUrl,
                    freeRooms: req.body['free-rooms'],
                    errors: err.message.split('\n')
                }
            }
            res.render('create', data);
        }
    });

router.get('/details/:id', isAuth(), async (req, res) => {
    const data = await req.storage.getById(req.params.id);
    const user = await req.user.getUserByUsername(res.locals.user.username);

    const ctx = {
        title: 'Details page',
        data,
        owner: res.locals.user.username == data.owner,
        booked: user.bookedHotels.find(x => x == req.params.id)
    }

    res.render('details', ctx);
});

router.get('/edit/:id', preloadHotel(), isOwner(), async (req, res) => {
    const hotelData = await req.storage.getById(req.params.id);

    const ctx = {
        title: 'Edit page',
        hotelData
    }
    res.render('edit', ctx);
});

router.post('/edit/:id', preloadHotel(), isOwner(),
    body('hotel')
        .trim()
        .isLength({ min: 4 })
        .withMessage('Hotel should be atleast 4 characters long!'),
    body('city')
        .trim()
        .isLength({ min: 3 })
        .withMessage('City should be atleast 3 characters long!'),
    body('imgUrl')
        .trim()
        .isURL()
        .withMessage('Please enter a valid URL!'),
    body('freeRooms')
        .trim()
        .custom((value) => {
            if (Number(value) > 100 || Number(value) < 1) {
                throw new Error('Free rooms should be between 1 and 100!');
            }
            return true;
        }),
    async (req, res) => {

        const data = {
            hotel: req.body.hotel,
            imgUrl: req.body.imgUrl,
            city: req.body.city,
            freeRooms: req.body.freeRooms
        };


        try {
            const errors = Object.values(validationResult(req).mapped());
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }
            await req.storage.edit(req.params.id, data);
            res.redirect(`/hotels/details/${req.params.id}`);
        } catch (err) {
            console.log(err);
            const hotelData = await req.storage.getById(req.params.id);

            const ctx = {
                title: 'Edit page',
                hotelData,
                errors: err.message.split('\n')
            }

            res.render('edit', ctx);
        }
    });

router.get('/delete/:id', preloadHotel(), isOwner(), async (req, res) => {
    try {
        const errors = Object.values(validationResult(req).mapped());
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.msg).join('\n'));
        }

        await req.storage.deleteHotel(req.params.id);
        res.redirect('/', 304, { title: 'Home page' });
    } catch (err) {
        console.log(err);
        res.redirect(`/hotels/details/${req.params.id}`, { errors: err.message.split('\n') })
    }
});

router.get('/book/:id', isAuth(), async (req, res) => {
    try {
        const errors = Object.values(validationResult(req).mapped());
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.msg).join('\n'));
        }

        await req.storage.book(req.params.id, res.locals.user.username);
        res.redirect(`/hotels/details/${req.params.id}`, 304, { title: 'Details page' });
    } catch (err) {
        console.log(err);
        res.render('noFreeRooms');
    }
})

module.exports = router;