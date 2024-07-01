const express = require('express');
const router = express.Router();
const camController = require('../app/controllers/testController');
router.get('/', camController.index);
module.exports = router