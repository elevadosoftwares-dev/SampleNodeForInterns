const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(200).send({
                success: false,
                "message": "Authorization headers missing"
            });
        }                                           

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(200).send({
                success: false,
                "message": "Token missing"
            });
        }

        const decode = await jwt.verify(token, process.env.jwt_secret);

        req.user = decode;

        next();
    } catch {
        res.status(200).send({
            success: false,
            "message": "Invalid token"
        });
    }
}