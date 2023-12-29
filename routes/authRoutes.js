const express = require('express');
const authController = require('../controllers/auth.controller');
const passport = require('../config/passport-config'); 

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', passport.authenticate('jwt', { session: false }), authController.login); 

module.exports = router;