const express = require('express');
const router = express.Router();
const testController = require('../app/controllers/testController.js');
router.get('/', testController.index);
router.post('/post', testController.createTest);
module.exports = router;
