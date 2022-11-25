const express = require('express');
const { createReport, readReportHouse, updateReport } = require('../controllers/report.controller');

const router = express.Router();

router.post('/report/create', createReport);
router.get('/report/list/:id', readReportHouse);
router.put('/report/update/:id', updateReport);

module.exports = router;