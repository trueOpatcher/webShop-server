const express = require('express');

const router = express.Router();

const image_Controller = require('../controllers/image');

router.get('/download', image_Controller.download_image);

module.exports = router;