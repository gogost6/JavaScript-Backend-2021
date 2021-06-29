const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isAuth, isGuest } = require('../middlewares/guards');

router.get('/register', isGuest(), (req, res) => {
    res.render('register', { title: 'Register page' });
});

router.post('/register', isGuest(),
    body('email')
        .trim()
        .isEmail()
        .withMessage('The email should be valid!'),
    body('password')
        .trim()
        .isLength({ min: 4 })
        .withMessage('The password input shouldbe atleast 4 characters long!'),
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
            res.redirect('/trips');
        } catch (err) {
            console.log(err);

            const ctx = {
                title: 'Register page',
                errors: err.message.split('\n'),
                data: {
                    email: req.body.email
                }
            };
            res.render('register', ctx);
        }
});

router.get('/login', isGuest(), (req, res) => {
    res.render('login');
});

router.post('/login', isGuest(),
    body('email')
        .trim()
        .isEmail()
        .withMessage('The email should be valid!'),
    body('password')
        .trim()
        .isLength({ min: 4 })
        .withMessage('The password input shouldbe atleast 4 characters long!'),
    async (req, res) => {
        try {
            const errors = Object.values(validationResult(req).mapped());
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }

            await req.auth.login(req.body);
            res.redirect('/trips');
        } catch (err) {
            console.log(err);

            const ctx = {
                title: 'Login page',
                errors: err.message.split('\n'),
                data: {
                    email: req.body.email
                }
            };
            res.render('login', ctx);
        }
});

router.get('/logout', isAuth(), (req, res) => {
    req.auth.logout();
    res.redirect('/trips');
});

module.exports = router;