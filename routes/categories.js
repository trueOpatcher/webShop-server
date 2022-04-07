const express = require('express');

const router = express.Router();

const categories_Controller = require('../controllers/categories');


router.get('/fetch', categories_Controller.get_categories);

router.post('/put', categories_Controller.post_categories);



module.exports = router;