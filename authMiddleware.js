const jwt = require('jsonwebtoken');
const { secret, refreshSecret, generateAccessToken } = require('./config');

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(403).json({ message: "Пользователь не авторизован" });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "Пользователь не авторизован" });
        }

        const decodedData = jwt.verify(token, secret);
        req.user = decodedData;
        next();
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            const refreshToken = req.headers['refresh-token'];
            if (!refreshToken) {
                return res.status(403).json({ message: "Требуется обновление токена" });
            }
            try {
                const decodedRefreshToken = jwt.verify(refreshToken, refreshSecret);
                const newToken = generateAccessToken(decodedRefreshToken.id, decodedRefreshToken.login);
                req.user = decodedRefreshToken;
                res.set('Authorization', `Bearer ${newToken}`);
                next();
            } catch (err) {
                return res.status(403).json({ message: "Неверный refresh token" });
            }
        } else {
            console.log(e);
            return res.status(403).json({ message: "Пользователь не авторизован" });
        }
        
    }
};
