const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.auth = (req, res, next) => {
    try {
        // console.log(req);
        //extract JWT token
        //pending ways to extract JWT token : from header, cookie
        // console.log("cookie : ", req.cookies.cookie);
        // console.log("body : ", req.body.token);
        // console.log("header : ", req.header("Authorization").replace("Bearer ", ""));

        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");
        // console.log(token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token Missing'
            })
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);

            req.user = decode; //to use in authZ
        }
        catch (err) {
            res.status(401).json({
                success: false,
                message: 'Token Invalid'
            })
        }
        next();
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

//authZ middlewares
exports.isStudent = (req, res, next) => {
    try {
        if (req.user.role !== 'Student') {
            return res.status(401).json({
                success: false,
                message: 'This is a Protected Route for Students'
            })
        }
        next();
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(401).json({
                success: false,
                message: 'This is a Protected Route for Admin'
            })
        }
        next();
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}