const upperAll = (req, res, next) => {
    // req.query
    // req.params
    // req.body
    // req.headers
    for (let key in req.query) {
        req.query[key] = req.query[key].toLowerCase();
    }

    next();
}

const auth = (req,res,next) => {
    // check user info
    const allowed = false;

    if (!allowed) {
        res.status(401).send('user not allowed')
        return;
    }

    next();
}


module.exports = { upperAll, auth };