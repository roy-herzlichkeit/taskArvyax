import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

const _requireAuth = (req, res, next) => {
    let token = req.cookies.jwt;
    
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (e, decodedToken) => {
            if (e) {
                console.log(e);
                return res.status(401).json({ message: 'error Unauth' });
            }
            req.user = decodedToken;
            console.log(decodedToken);
            next();
        });
    } else {
        return res.status(401).json({ message: 'Token Unauth' });
    }
};

export default { _requireAuth };