const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Problem in Hashing Password'
            })
        }

        const user = await User.create({ name, email, password: hashedPassword, role });

        return res.status(200).json({
            success: true,
            message: 'User created successfully'
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Error creating user'
        });
    }
}


exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please enter the details carefully'
            })
        }

        let user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User is not registered'
            })
        }

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        }

        if (await bcrypt.compare(password, user.password)) {
            //generate jwt token
            let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });

            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            // res.status(200).json({
            //     success: true,
            //     token,
            //     user,
            //     message: 'User logged in successfully'
            // })

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'User logged in successfully'
            })
        }
        else {
            res.status(402).json({
                success: false,
                message: 'Incorrect Password'
            })
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Error while logging in'
        })
    }
}