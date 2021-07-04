const router = require('express').Router();
const { getAll, getAllUser, getById, create, edit, deleteFurniture } = require('../services/furniture');
const { parseError } = require('../util');
const { isAuth, isGuest, isOwner } = require('../middlewares/guards');
const preload = require('../middlewares/preload');

router.get('/', async (req, res) => {
    if (Object.values(req.query).length > 0) {
        try {
            const result = await getAllUser(req.user._id);
            res.status(202).json(result);
        } catch (err) {
            console.log(err);
            res.status(err.status || 400).end();
        }
    } else {
        const data = await getAll();
        res.json(data);
    }
});

router.post('/', isAuth(), async (req, res) => {
    const data = {
        make: req.body.make,
        model: req.body.model,
        year: Number(req.body.year),
        description: req.body.description,
        price: Number(req.body.price),
        img: req.body.img,
        material: req.body.material,
        owner: req.user._id
    }

    try {
        await create(data);
        res.status(201).json(req.body);
    } catch (err) {
        console.log(err);
        const message = parseError(err);
        res.status(err.status || 400).json({ message })
    }
});

router.get('/:id', async (req, res) => {
    const item = await getById(req.params.id);
    item._ownerId = item.owner;
    res.json(item);
});

router.put('/:id', preload(), isOwner(), async (req, res) => {
    const data = {
        make: req.body.make,
        model: req.body.model,
        year: Number(req.body.year),
        description: req.body.description,
        price: Number(req.body.price),
        img: req.body.img,
        material: req.body.material
    }

    try {
        const result = await edit(req.params.id, data);
        res.status(202).json(result);
    } catch (err) {
        console.log(err);
        const message = parseError(err);
        res.status(err.status || 400).json({ message });
    }
});

router.delete('/:id', preload(), isOwner(), async (req, res) => {
    try {
        await deleteFurniture(req.params.id);
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(err.status || 400).json({ message: err.message });
    }
});

module.exports = router;