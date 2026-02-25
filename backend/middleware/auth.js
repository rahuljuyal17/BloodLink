const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({ message: 'Token verification failed, authorization denied' });
        }

        req.user = verified.id;
        req.role = verified.role;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.role || !roles.includes(req.role)) {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }
        next();
    };
};

module.exports = { authMiddleware, requireRole };
