function preloadCat() {
    return async (req, res, next) => {
        req.data = req.data || {};

        try {
            const cat = await req.storage.getById(req.params.id);
            console.log(cat);
            if (cat) {
                req.data.cat = cat;
            }
        } catch (err) {
            console.error('Database error:', err.message);
        }

        next();
    };
}

module.exports = {
    preloadCat
};