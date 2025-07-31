import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const _requireAuth = (req, res, next) => {
    let token = req.cookies.jwt;

    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (e, decodedToken) => {
            if (e) {
                console.log(e);
                return res.status(401).json({ message: 'Error: Unauthorised' });
            }
            req.user = await User.findById(decodedToken._id);
            next();
        });
    } else {
        return res.status(401).json({ message: 'Error: Unauthorised' });
    }
};

const _checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (e, decodedToken) => {
            if (e) {
                console.log(e);
                res.locals.user = null;
                next();
            } else {
                req.user = res.locals.user = await User.findById(decodedToken._id);
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

export default { _requireAuth, _checkUser };