const {
    postUserModel, loginModel, setRefreshToken
} = require('../../models/auth/authModels');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerController = asyncHandler(async(req, res) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirm_password;
    const image = req.file;

    const url = req.originalUrl;
    const role = url.split('/')[3];

    if(password !== confirmPassword) {
        return res.status(400).json(
            {
                status: 400,
                message: 'Password and confirm password do not match'
            }
        )
    }

    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const data = {
        email: req.body.email,
        password: hash,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        image: image ? image.filename : null,
        contact_no: req.body.contact_no,
        role_id: (role === 'users') ? 1 : (role === 'admin') ? 2 : 0
    }

    await postUserModel(data);

    return res.status(200).json(
        {
            status: 200,
            message: 'User registered successfully'
        }
    )
})

const loginController = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const checkUser = await loginModel(email);

    if(!checkUser) {
        return res.status(404).json(
            {
                status: 404,
                message: 'User not found'
            }
        )
    }

    if(!bcrypt.compareSync(password, checkUser.password)) {
        return res.status(400).json(
            {
                status: 400,
                message: 'Invalid credentials'
            }
        )
    }

    const accessToken = jwt.sign(
        {
            email: checkUser.email,
            name: checkUser.first_name + ' ' + checkUser.last_name,
            role: checkUser.role
        },
        process.env.ACCESS,
        {expiresIn: '25s'}
    )

    const refreshToken = jwt.sign(
        {
            email: checkUser.email,
            name: checkUser.first_name + ' ' + checkUser.last_name,
            role: checkUser.role
        },
        process.env.REFRESH,
        {expiresIn: '25m'}
    )
    
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    await setRefreshToken(email, refreshToken);
    
    return res.status(200).json(
        {
            status: 200,
            message: 'Logged in successfully',
            accessToken: accessToken
        }
    )
})

module.exports = {
    registerController,
    loginController
}