function preloadTheather() {
    return async (req, res, next) => {
        req.data = req.data || {};

        try {
            const theather = await req.storage.getById(req.params.id);

            if (theather) {
                req.data.theather = theather;
            }
        } catch (err) {
            console.error('Database error:', err.message);
        }

        next();
    };
}

module.exports = {
    preloadTheather
};