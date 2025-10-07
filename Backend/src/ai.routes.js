const express = require('express');
const aiController = require('./ai.controller')

const router  = express.Router();


router.post('/get-review',aiController.getReview)


module.exports = router;