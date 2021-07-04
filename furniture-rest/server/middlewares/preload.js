const { getById } = require('../services/furniture')

module.exports = (paramName = 'id') => async (req, res, next) => {
    const id = req.params[paramName];

    const data = await getById(id);
    req.data = data;

    next();
}