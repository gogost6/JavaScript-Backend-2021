function isAuth() {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: 'Please sign in.' })
        } else {
            next();
        }
    }
}

function isGuest() {
    return (req, res, next) => {
        if (req.user) {
            res.status(401).json({ message: 'You are already signed in.' });
        } else {
            next();
        }
    }
}

function isOwner() {
    return (req, res, next) => {
        const item = req.data;

        if (req.user._id == item.owner) {
            next();
        } else {
            res.status(401).json({ message: 'You are not the owner.' })
        }
    }
}

module.exports = {
    isAuth,
    isGuest,
    isOwner
}