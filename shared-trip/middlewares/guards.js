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
            res.redirect('/tutorials');
        }
    };
}

function isOwner() {
    return (req, res, next) => {
        if (req.data.trip && req.user && (req.data.trip.owner.email == res.locals.user.email)) {
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