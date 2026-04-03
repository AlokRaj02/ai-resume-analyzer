import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const optionalAuth = async (req, res, next) => {
    let token;
    req.user = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_cyber_ai');
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            console.warn("Invalid token passed, treating as guest.");
        }
    }
    next();
};

export const protect = async (req, res, next) => {
    await optionalAuth(req, res, () => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authorized. Please log in.' });
        }
        next();
    });
};
