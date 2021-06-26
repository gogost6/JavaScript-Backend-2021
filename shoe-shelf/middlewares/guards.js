function isAuth() {
    return (req, res, next) => {
        if (res.locals.user != undefined) {
            next();
        } else {
            res.redirect('/user/login');
        }
    };
}

function isGuest() {
    return (req, res, next) => {
        if (res.locals.user == undefined) {
            next();
        } else {
            res.redirect('/shoes');
        }
    };
}

function isOwner() {
    return (req, res, next) => {
        if (req.data.shoe && req.user && (req.data.shoe.owner == res.locals.user.email)) {
            next();
        } else {
            res.redirect('/user/login');
        }
    };
}

module.exports = {
    isAuth,
    isGuest,
    isOwner
};