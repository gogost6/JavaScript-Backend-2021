const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isAuth, isGuest } = require('../middlewares/guards');

router.get('/register', isGuest(), (req, res) => {
    res.render('user pages/register', { title: 'Register page' });
});

router.post('/register', isGuest(),
    body('username')
        .trim()
        .notEmpty()
        .withMessage('The username input should not be empty!'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('The password input should not be empty!'),
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

            await req.auth.register(req.body);
            res.redirect('/tutorials');
        } catch (err) {
            console.log(err);

            const ctx = {
                title: 'Register page',
                errors: err.message.split('\n'),
                data: {
                    username: req.body.username
                }
            };
            res.render('user pages/register', ctx);
        }
    });

router.get('/login', isGuest(), (req, res) => {
    res.render('user pages/login');
});

router.post('/login', isGuest(), body('username')
    .trim()
    .notEmpty()
    .withMessage('The username input should not be empty!'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('The password input should not be empty!'),
    async (req, res) => {
        try {
            const errors = Object.values(validationResult(req).mapped());
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            }

            await req.auth.login(req.body);
            res.redirect('/tutorials');
        } catch (err) {
            console.log(err);

            const ctx = {
                title: 'Login page',
                errors: err.message.split('\n'),
                data: {
                    username: req.body.username
                }
            };
            res.render('user pages/login', ctx);
        }
    });

router.get('/logout', isAuth(), (req, res) => {
    req.auth.logout();
    res.redirect('/tutorials');
});

module.exports = router;