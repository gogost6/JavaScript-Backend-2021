function preloadTut() {
    return async (req, res, next) => {
        req.data = req.data || {};

        try {
            const tut = await req.storage.getById(req.params.id);

            if (tut) {
                req.data.tut = tut;
            }
        } catch (err) {
            console.error('Database error:', err.message);
        }

        next();
    };
}

module.exports = {
    preloadTut
};