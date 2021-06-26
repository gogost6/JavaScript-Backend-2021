const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isAuth, isGuest } = require('../middlewares/guards');

router.get('/register', isGuest(), (req, res) => {
    res.render('user/register', { title: 'Register page' });
});

router.post('/register', isGuest(),
    body('email')
        .trim()
        .isLength({min: 3})
        .withMessage('The email input must be at least 3 characters long'),
    body('password')
        .trim()
        .isLength({ min: 3 })
        .withMessage('The password should be atleast 3 characters long!'),
    body('rePassword').trim().custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error('Passwords don\'t match');
        }
        return true;
    }),
    async (req, res) => {
        try {
            const errors = Object.values(validationResult(req).mapped());
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }
            console.log(req.body);
            await req.auth.register(req.body);
            res.redirect('/shoes');
        } catch (err) {
            console.log(err);

            const ctx = {
                title: 'Register',
                errors: err.message.split('\n'),
                data: {
                    email: req.body.email,
                    fullName: req.body.fullName
                }
            };
            res.render('user/register', ctx);
        }
    });

router.get('/login', isGuest(), (req, res) => {
    res.render('user/login');
});

router.post('/login', isGuest(), async (req, res) => {
    try {
        const errors = Object.values(validationResult(req).mapped());
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.msg).join('\n'));
        }

        await req.auth.login(req.body);
        res.redirect('/shoes');
    } catch (err) {
        console.log(err);

        const ctx = {
            title: 'Login',
            errors: err.message.split('\n'),
            data: {
                email: req.body.email
            }
        };
        res.render('user/login', ctx);
    }
});

router.get('/logout', isAuth(), (req, res) => {
    req.auth.logout();
    res.redirect('/shoes');
});

module.exports = router;