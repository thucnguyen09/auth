const jwt = require('jsonwebtoken');
class TokenMiddleware {
    verifyToken(req, res, next) {
        const token = req.headers.token;
        if(token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (err, user) => {
                if(err) {
                    res.status(403).json("Token is not valid");
                }
                req.user = user;
                next();
            })
        } else {
            res.status(401).json("you're not authenticated");
        }
    }

    verifyTokenAndAdminAuth(req, res, next) {
        const tokenMiddleware = new TokenMiddleware();
        tokenMiddleware.verifyToken(req, res, () => {
            if(req.user.id == req.params.id || req.user.admin) {
                next();
            } else {
                res.status(403).json("you're not allowed to delete other");
            }
        })
    }
}
module.exports = new TokenMiddleware();