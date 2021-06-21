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
            res.redirect('/theathers');
        }
    };
}

function isOwner() {
    return (req, res, next) => {
        if (req.data.theather && req.user && (req.data.theather.owner == res.locals.user.username)) {
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