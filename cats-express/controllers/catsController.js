const express = require('express');
const router = express.Router();
const { preloadCat } = require('../middlewares/preload')

router.get('/', async (req, res) => {
    console.log(req.query);
    const cats = await req.storage.getAll(req.query);

    const ctx = {
        title: 'Cat Shelter',
        cats,
        search: req.query.name || ''
    }

    res.render('index', ctx)
});


router.get('/add-cat', async (req, res) => {
    res.render('addCat', {
        title: 'Add Cat',
        breeds: await req.storage.getAllBreeds()
    })
});

router.post('/add-cat', async (req, res) => {
    const cat = {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        breed: req.body.breed
    };

    try {
        await req.storage.create(cat);
    } catch (err) {
        if (err.name == 'ValidationError') {
            return res.render('addCat', { title: 'Add Cat', error: 'All fields are required. Image URL must be a valid URL.' });
        }
    }

    res.redirect('/');
});

router.get('/add-breed', (req, res) => {
    res.render('addBreed', { title: 'Add Breed' })
});

router.post('/add-breed', async (req, res) => {
    const breed = {
        name: req.body.breed
    };

    try {
        await req.storage.createBreed(breed);
    } catch (err) {
        if (err.name == 'ValidationError') {
            return res.render('addBreed', { title: 'Add Breed', error: 'Field should not be empty!' });
        }
    }

    res.redirect('/');
});

router.get('/edit/:id', preloadCat(), async (req, res) => {
    const cat = req.data.cat;
    if(!cat) {
        res.send('Error 404')
    } else {
        const ctx = {
            breeds: await req.storage.getAllBreeds(),
            cat,
            title: 'Edit Page'
        }
    
        res.render('editCat', ctx);
    }
});

router.post('/edit/:id', preloadCat(), async (req, res) => {
    const cat = {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        breed: req.body.breed
    };
    console.log(cat);

    try {
        await req.storage.edit(req.params.id, cat);
        res.redirect('/');
    } catch (err) {
        res.send('Error 404');
    }
});

router.get('/delete/:id', async (req, res) => {
    try {
        await req.storage.deleteCat(req.params.id);
        res.redirect('/');
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;