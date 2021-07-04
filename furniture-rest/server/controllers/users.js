const router = require('express').Router();

const { register, login } = require('../services/user')

router.post('/register', async (req, res) => {
    let { email, password } = req.body;

    try {
        if (!email) {
            throw new Error('Email is required.');
        }

        if (password.trim().length < 3) {
            throw new Error('Password must be atleast 3 characters long.');
        }

        const userData = await register(email.toLocaleLowerCase().trim(), password.trim());
        res.json(userData);
    } catch (err) {
        console.log(err.message);
        res.status(err.status || 400).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    let { email, password } = req.body;

    try {
        if (!email) {
            throw new Error('Email is required.');
        }

        if (password.trim().length < 3) {
            throw new Error('Password is required.');
        }

        const userData = await login(email.toLocaleLowerCase().trim(), password.trim());
        res.json(userData);
    } catch (err) {
        console.log(err.message);
        res.status(err.status || 400).json({ message: err.message });
    }
});

router.get('/logout', (req, res) => {
    res.status(204).end();
})

module.exports = router;