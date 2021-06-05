const { request } = require("express");

module.exports = {
    edit: async (req, res) => {
        const cube = await req.storage.getById(req.params.id);
        cube[`select${cube.difficulty}`] = true;
        if(cube) {
            const ctx = {
                title: 'Edit page',
                cube
            }

            res.render('edit', ctx);
        } else {
            res.redirect('/404');
        }
    },
    post: async (req, res) => {
        const cube = {
            name: req.body.name,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            difficulty: Number(req.body.difficulty)
        }
        try {
            await req.storage.edit(req.params.id, cube);
            res.redirect('/');
        } catch (error) {
            res.redirect('404');
        }
    }
}