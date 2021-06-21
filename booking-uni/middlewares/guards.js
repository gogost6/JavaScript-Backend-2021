function isAuth() {
    return (req, res, next) => {
        if (res.locals.user != undefined) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    };
}

function isGuest() {
    return (req, res, next) => {
        if (res.locals.user == undefined) {
            next();
        } else {
            res.redirect('/hotels');
        }
    };
}

function isOwner() {
    return (req, res, next) => {
        if (req.data.hotel && req.user && (req.data.hotel.owner == res.locals.user.username)) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    };
}

module.exports = {
    isAuth,
    isGuest,
    isOwner
};