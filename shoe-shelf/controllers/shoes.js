const router = require('express').Router();
const { check, body, validationResult } = require('express-validator');
const { isOwner, isGuest, isAuth } = require('../middlewares/guards');
const { preloadShoe } = require('../middlewares/preload');
router.get('/', async (req, res) => {
    if (res.locals.user) {
        const ctx = {
            title: 'Shoe shelf',
            shoes: await req.storage.getAll()
        }
        res.render('home/shoes', ctx);
    } else {
        res.render('home/home', { title: 'Shoe shelf', });
    }
});

router.get('/create', isAuth(), async (req, res) => {
    res.render('shoes/create', { title: 'Create page' })
});

router.post('/create',
    isAuth(),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name should not be empty!'),
    body('price')
        .trim()
        .toInt()
        .notEmpty()
        .withMessage('Price should not be empty!'),
    body('imageUrl')
        .trim()
        .notEmpty()
        .withMessage('Image URL should not be empty!'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description should not be empty!'),
    body('brand')
        .trim()
        .notEmpty()
        .withMessage('Brand should not be empty!'),
    async (req, res) => {
        try {
            const errors = Object.values(validationResult(req).mapped());
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }

            let email = res.locals.user.email;
            const ctx = {
                name: req.body.name,
                price: req.body.price,
                imageUrl: req.body.imageUrl,
                description: req.body.description,
                brand: req.body.brand,
                owner: res.locals.user.email
            }

            await req.storage.create(ctx, email);
            res.redirect('/');
        } catch (err) {
            console.log(err);
            const data = {
                errors: err.message.split('\n'),
                title: 'Create page',
                data: {
                    name: req.body.name,
                    price: req.body.price,
                    imageUrl: req.body.imageUrl,
                    description: req.body.description,
                    brand: req.body.brand,
                    errors: err.message.split('\n')
                }
            }
            res.redirect('shoes/create', data);
        }
    });

router.get('/details/:id', isAuth(), async (req, res) => {
    const shoe = await req.storage.getById(req.params.id);
    const user = await req.user.getUserByEmail(res.locals.user.email);
    const owner = shoe.owner == user.email ? true : false;
    console.log(shoe.buyers.length);
    if (owner) {
        const ctx = {
            shoe,
            owner
        }
        res.render('shoes/details', ctx)
    } else {
        const ctx = {
            shoe,
            owner,
            bought: user.offersBought.find(x => x == req.params.id) ? true : false
        }
        
        res.render('shoes/details', ctx)
    }
});

router.get('/edit/:id', preloadShoe(), isOwner(), async (req, res) => {
    const ctx = {
        title: 'Edit page',
        shoe: await req.storage.getById(req.params.id)
    }
    res.render('shoes/edit', ctx);
})

router.post('/edit/:id',
    preloadShoe(),
    isOwner(),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name should not be empty!'),
    body('price')
        .trim()
        .toInt()
        .notEmpty()
        .withMessage('Price should not be empty!'),
    body('imageUrl')
        .trim()
        .notEmpty()
        .withMessage('Image URL should not be empty!'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description should not be empty!'),
    body('brand')
        .trim()
        .notEmpty()
        .withMessage('Brand should not be empty!'),
    async (req, res) => {
        try {
            const errors = Object.values(validationResult(req).mapped());
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }

            const ctx = {
                name: req.body.name,
                price: req.body.price,
                imageUrl: req.body.imageUrl,
                description: req.body.description,
                brand: req.body.brand
            }

            await req.storage.edit(req.params.id, ctx);
            res.redirect(`/shoes/details/${req.params.id}`);
        } catch (err) {
            console.log(err);
            const data = {
                errors: err.message.split('\n'),
                title: 'Edit page',
                data: {
                    name: req.body.name,
                    price: req.body.price,
                    imageUrl: req.body.imageUrl,
                    description: req.body.description,
                    brand: req.body.brand,
                    errors: err.message.split('\n')
                }
            }
            res.redirect(`/shoes/edit/${req.params.id}`, data);
        }
    });

router.get('/delete/:id', preloadShoe(), isOwner(), async (req, res) => {
    try {
        await req.storage.deleteShoe(req.params.id);
        res.redirect('/shoes');
    } catch (err) {
        console.log(err);
        res.redirect(`/shoes/details/${req.params.id}`);
    }
});

router.get('/buy/:id', isAuth(), async (req, res) => {
    const shoe = await req.storage.getById(req.params.id);
    
    const ctx = {
        shoe,
        owner: shoe.owner == res.locals.user.email ? true : false,
        bought: shoe.buyers.includes(res.locals.user.email) ? true : false
    }

    try {
        await req.storage.buy(req.params.id, res.locals.user.email);
        res.redirect(`/shoes/details/${req.params.id}`, 200, ctx);
    } catch (err) {
        console.log(err);
        res.redirect(`/shoes/details/${req.params.id}`, 200, ctx);
    }
});

router.get('/profile', async (req, res) => {
    const user = await req.user.getUserByEmail(res.locals.user.email);
    const bought = user.offersBought.length > 0 ? true : false;
    if(bought) {
        
    }
    const ctx = {
        user,
        bought
    }
    res.render('user/profile', ctx);
});

module.exports = router;