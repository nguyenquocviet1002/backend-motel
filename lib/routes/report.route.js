const express = require('express');
const {
  createReport,
  readReportHouse,
  updateReport,
  readReportRoom,
  removeReport,
  countReportNotComp,
} = require('../controllers/report.controller');
const { requireSignin } = require('../controllers/auth.controller');
const { checkIdHouse } = require('../validator');

const router = express.Router();

router.post('/report/create', createReport);
router.get('/report/list-house/:id', requireSignin, readReportHouse);
router.get('/report/list-room/:id', readReportRoom);
router.put('/report/update/:id', requireSignin, updateReport);
router.delete('/report/remove/:id', removeReport);
router.get('/report/count-not-complete/:idHouse', checkIdHouse, countReportNotComp);

module.exports = router;
