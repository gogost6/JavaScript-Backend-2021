function preloadShoe() {
    return async (req, res, next) => {
        req.data = req.data || {};

        try {
            const shoe = await req.storage.getById(req.params.id);

            if (shoe) {
                req.data.shoe = shoe;
            }
        } catch (err) {
            console.error('Database error:', err.message);
        }

        next();
    };
}

module.exports = {
    preloadShoe
};