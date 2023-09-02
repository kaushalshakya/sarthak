const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJwt = (req, res, next) => {
   const authHeader = req.headers['authorization'];

    if(!authHeader) {
        return res.status(401).json(
            {
                status: 401,
                message: 'Unauthenticated'
            }
        )
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS, (err, decoded) => {
        if(err) {
            return res.status(400).json(
                {
                    status: 400,
                    message: 'Token expired or altered'
                }
            )
        }
        console.log(decoded);
        req.name = decoded.name;
        req.email = decoded.email;
        req.id = decoded.id;
        next();
    })
}

module.exports = verifyJwt