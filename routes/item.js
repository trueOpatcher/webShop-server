const express = require('express');

const router = express.Router();

const item_Controller = require('../controllers/item');

router.post('/create', item_Controller.create_item);

router.delete('/delete', item_Controller.delete_item);

module.exports = router;