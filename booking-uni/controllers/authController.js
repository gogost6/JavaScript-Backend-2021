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
        .withMessage('Please enter a valid email!'),
    body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('The password should be atleast 5 characters long!')
        .matches(/[\d\w]+/, 'i')
        .withMessage('The password should have only english letters and digits!'),
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
            res.redirect('/hotels');
        } catch (err) {
            console.log(err);

            const ctx = {
                title: 'Register',
                errors: err.message.split('\n'),
                data: {
                    username: req.body.username,
                    email: req.body.email
                }
            };
            res.render('register', ctx);
        }
    });

router.get('/login', isGuest(), (req, res) => {
    res.render('login');
});

router.post('/login', isGuest(), async (req, res) => {
    try {
        const errors = Object.values(validationResult(req).mapped());
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.msg).join('\n'));
        }

        await req.auth.login(req.body);
        res.redirect('/hotels');
    } catch (err) {
        console.log(err);

        const ctx = {
            title: 'Login',
            errors: err.message.split('\n'),
            data: {
                username: req.body.username
            }
        };
        res.render('login', ctx);
    }
});

router.get('/logout', isAuth(), (req, res) => {
    req.auth.logout();
    res.redirect('/hotels');
});

module.exports = router;