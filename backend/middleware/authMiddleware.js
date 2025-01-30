// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Get the token from the header

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });

        req.user = user;  // Attach the user data to the request
        next();  // Proceed to the next middleware or route handler
    });
}

module.exports = { authenticateToken };
