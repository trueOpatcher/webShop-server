const express = require('express');

const router = express.Router();

const auth_Controller = require('../controllers/auth');


router.post('/login', auth_Controller.post_login);

router.post('/signup', auth_Controller.post_signup);

router.get('/logout', auth_Controller.get_logout);

router.get('/isauth', auth_Controller.get_isAuth);

router.get('/isadmin', auth_Controller.get_isAdmin);
module.exports = router;