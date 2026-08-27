const express = require('express');
const { getReport, getAnalytics } = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', getAnalytics);
router.get('/:interviewId', getReport);

module.exports = router;
