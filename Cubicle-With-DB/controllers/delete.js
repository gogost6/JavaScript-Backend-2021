module.exports = {
    delete: async (req, res) => {
        await req.storage.deleteCube(req.params.id);
        res.redirect('/');
    }
}