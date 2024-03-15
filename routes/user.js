const express = require('express')
const router = express.Router();
const User = require('../models/User');

const { login, signup } = require('../controllers/Auth');
const { auth, isStudent, isAdmin } = require('../middlewares/auth');

router.post('/login', login);
router.post('/signup', signup);

router.get('/test', auth, (req, res) => {
    res.json({
        success: true,
        message: 'Test successful'
    })
});

//Protected Route
router.get('/student', auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to the Protected Route for Students'
    });
})

router.get('/admin', auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to the Protected Route for Admin'
    });
})

router.get('/getEmail', auth, async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id);
        res.status(200).json({
            success: true,
            data: user,
            message: 'Welcome to the Email Route'
        });
    }
    catch (err) {
        res.status(200).json({
            success: false,
            message: err.message
        });
    }

});


module.exports = router;