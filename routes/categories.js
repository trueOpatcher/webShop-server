const express = require('express');

const router = express.Router();

const categories_Controller = require('../controllers/categories');


router.get('/fetch', categories_Controller.get_categories);

router.post('/add/category', categories_Controller.post_categories);
router.post('/add/sub', categories_Controller.post_sub_categories);


router.delete('/delete', categories_Controller.delete_category);
router.delete('/delete/sub', categories_Controller.delete_sub_category);

module.exports = router;
